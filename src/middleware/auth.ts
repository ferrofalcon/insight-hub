import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

interface JwtPayload {
  id: string
  role: "user" | "seller" | "admin"
}

export const auth = (
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1] // Expecting "Bearer <token>"
  if (!token) return res.status(401).json({ message: "No token provided" })

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ message: "Invalid token" })
  }
}

export const requireRole = (role: "user" | "seller" | "admin") => {
  return (
    req: Request & { user?: JwtPayload },
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" })
    if (req.user.role !== role)
      return res.status(403).json({ message: "Forbidden" })
    next()
  }
}
