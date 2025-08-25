import { z } from "zod"

export const productSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters long"),
  description: z.string().optional(),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
})

export type ProductInput = z.infer<typeof productSchema>
