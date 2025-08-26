import { Request, Response } from "express"
import Review from "../models/Review"
import Product from "../models/Product"

export const getReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({
      productId: req.params.productId,
    }).populate("userId", "name")
    res.json(reviews)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

export const createReview = async (
  req: Request & { user?: any },
  res: Response
) => {
  try {
    const { rating, comment } = req.body
    const productId = req.params.productId
    const userId = (req as any).user.id

    const existing = await Review.findOne({ productId, userId })
    if (existing) return res.status(400).json({ message: "Already reviewed" })

    const review = await Review.create({ productId, userId, rating, comment })

    const stats = await Review.aggregate([
      { $match: { productId: review.productId } },
      {
        $group: {
          _id: "$productId",
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ])

    if (stats.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        $set: {
          ratingAvg: stats[0].avgRating,
          ratingCount: stats[0].totalReviews,
        },
      })
    }

    res.status(201).json(review)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}
