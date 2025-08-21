import { Request, Response } from "express"
import Product from "../models/Product"
import { productSchema } from "../validators/product"

export const createProduct = async (
  req: Request & { user?: any },
  res: Response
) => {
  try {
    const parsed = productSchema.parse(req.body)

    const product = await Product.create({
      ...parsed,
      sellerId: req.user.id,
    })

    res.status(201).json(product)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search, minPrice, maxPrice } = req.query

    const query: any = {}

    if (search) {
      query.$text = { $search: search as string }
    }

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }

    const products = await Product.find(query)
      .skip((+page - 1) * +limit)
      .limit(+limit)

    res.json(products)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const updateProduct = async (
  req: Request & { user?: any },
  res: Response
) => {
  try {
    const parsed = productSchema.partial().parse(req.body)

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, sellerId: req.user.id },
      parsed,
      { new: true }
    )

    if (!product)
      return res.status(404).json({ message: "Product not found or not yours" })

    res.json(product)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const deleteProduct = async (
  req: Request & { user?: any },
  res: Response
) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      sellerId: req.user.id,
    })

    if (!product)
      return res.status(404).json({ message: "Product not found or not yours" })

    res.json({ message: "Product deleted" })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
