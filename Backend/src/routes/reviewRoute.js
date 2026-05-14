import express from "express";
import ReviewController from "../controllers/reviewController.js";
import { ProtectedRoute } from "../middlewares/ProtectedRoute.js";

const router = express.Router();

router.get("/", ReviewController.getAllReviews);
router.post("/", ProtectedRoute, ReviewController.createReview);
router.delete("/:id", ReviewController.deleteReview);

export default router;