import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db"
import authRoutes from "./routes/authRoutes"
import productRoutes from "./routes/productRoutes"
import orderRoutes from "./routes/orderRoutes"
import reviewRoutes from "./routes/reviewRoutes"
import { auth, requireRole } from "./middleware/auth"

dotenv.config()
const app = express()
app.use(express.json())

connectDB()

app.get("/", (_, res) => res.send("API is running..."))

app.use("/api/auth", authRoutes)

app.use("/api/products", productRoutes)

app.use("/api/orders", orderRoutes)

app.use("/api/reviews", reviewRoutes)

app.get("/api/protected", auth, requireRole("seller"), (req, res) => {
  res.json({ message: "Hello Seller, this is protected data!" })
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
