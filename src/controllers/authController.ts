import { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User"
import { registerSchema, loginSchema } from "../validators/auth"

export const register = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.parse(req.body)

    const existing = await User.findOne({ email: parsed.email })
    if (existing)
      return res.status(400).json({ message: "Email already in use" })

    const hashedPassword = await bcrypt.hash(parsed.password, 10)

    const user = await User.create({
      ...parsed,
      password: hashedPassword,
    })

    res
      .status(201)
      .json({
        message: "User registered",
        user: { id: user._id, email: user.email, role: user.role },
      })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.parse(req.body)

    const user = await User.findOne({ email: parsed.email })
    if (!user) return res.status(400).json({ message: "Invalid credentials" })

    const isMatch = await bcrypt.compare(parsed.password, user.password)
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" })

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    )

    res.json({ token })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
