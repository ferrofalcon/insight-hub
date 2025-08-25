import { Router } from "express"
import mongoose from "mongoose"
import Order from "../models/Order"
import Product from "../models/Product"

const router = Router()

router.post("/", async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { buyerId, items } = req.body

    if (!buyerId || !items || !Array.isArray(items)) {
      return res.status(400).json({ message: "Invalid request" })
    }

    let totalAmount = 0

    for (const item of items) {
      const product = await Product.findById(item.productId).session(session)
      if (!product) {
        throw new Error("Product not found")
      }
      if (product.stock < item.qty) {
        throw new Error(`Not enough stock for ${product.title}`)
      }

      product.stock -= item.qty
      await product.save({ session })

      totalAmount += product.price * item.qty
      item.priceAtPurchase = product.price
    }

    const order = await Order.create(
      [
        {
          buyerId,
          items,
          totalAmount,
          status: "pending",
        },
      ],
      { session }
    )

    await session.commitTransaction()
    session.endSession()

    res.status(201).json(order[0])
  } catch (error: any) {
    await session.abortTransaction()
    session.endSession()
    res.status(400).json({ message: error.message })
  }
})

export default router
