import { Router } from "express"
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController"
import { auth, requireRole } from "../middleware/auth"

const router = Router()

router.post("/", auth, requireRole("seller"), createProduct)
router.get("/", getProducts)
router.put("/:id", auth, requireRole("seller"), updateProduct)
router.delete("/:id", auth, requireRole("seller"), deleteProduct)

export default router
