import express from "express";
import TourController from "../controllers/tourController.js";

const router = express.Router();

router.get("/", TourController.getAllTours);
router.get("/:id", TourController.getTourById);
router.post("/", TourController.createTour);
router.put("/:id", TourController.updateTour);
router.delete("/:id", TourController.deleteTour);
router.patch("/:id/status", TourController.updateTourStatus);

export default router;