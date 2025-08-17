import mongoose, { Document, Schema } from "mongoose"

export interface IOrderItem {
  productId: mongoose.Types.ObjectId
  qty: number
  priceAtPurchase: number
}

export interface IOrder extends Document {
  buyerId: mongoose.Types.ObjectId
  items: IOrderItem[]
  status: "pending" | "shipped" | "delivered"
}

const orderSchema = new Schema<IOrder>(
  {
    buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        qty: { type: Number, required: true },
        priceAtPurchase: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
)

export default mongoose.model<IOrder>("Order", orderSchema)
