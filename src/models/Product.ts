import mongoose, { Document, Schema } from "mongoose"

export interface IProduct extends Document {
  title: string
  description: string
  price: number
  stock: number
  sellerId: mongoose.Types.ObjectId
}

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
)

productSchema.index({ title: "text", description: "text" })
productSchema.index({ sellerId: 1, createdAt: -1 })

export default mongoose.model<IProduct>("Product", productSchema)
