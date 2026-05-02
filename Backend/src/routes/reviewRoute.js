import express from "express";
import ReviewController from "../controllers/reviewController.js";
import { ProtectedRoute } from "../middlewares/ProtectedRoute.js";
const router = express.Router();
router.post("/", ProtectedRoute, ReviewController.createReview);
export default router;