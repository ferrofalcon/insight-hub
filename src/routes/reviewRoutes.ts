import { Router } from "express"
import { auth } from "../middleware/auth"
import { createReview, getReviews } from "../controllers/reviewController"

const router = Router()

router.get("/:productId", getReviews)
router.post("/:productId", auth, createReview)

export default router
