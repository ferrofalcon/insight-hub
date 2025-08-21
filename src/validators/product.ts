import { z } from "zod"

export const productSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
})

export type ProductInput = z.infer<typeof productSchema>
