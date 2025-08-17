import dotenv from "dotenv"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import connectDB from "../config/db"
import User from "../models/User"
import Product from "../models/Product"

dotenv.config()

const seed = async () => {
  await connectDB()
  await User.deleteMany()
  await Product.deleteMany()

  const hashedPassword = await bcrypt.hash("password123", 10)

  const seller = await User.create({
    name: "Test Seller",
    email: "seller@example.com",
    password: hashedPassword,
    role: "seller",
  })

  await Product.create([
    {
      title: "Sample Product 1",
      description: "This is a test product",
      price: 100,
      stock: 10,
      sellerId: seller._id,
    },
    {
      title: "Sample Product 2",
      description: "This is another test product",
      price: 200,
      stock: 5,
      sellerId: seller._id,
    },
  ])

  console.log("✅ Database seeded!")
  process.exit()
}

seed()
