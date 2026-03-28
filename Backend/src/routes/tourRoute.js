import express from "express";
import {
    getToursController,
    getTourController,
    createTourController,
    updateTourController,
    deleteTourController,
    searchTourController,
    toggleTrangThaiController
} from "../controllers/tourController.js";

const router = express.Router();

// TOUR
router.get("/search", searchTourController);

router.get("/", getToursController);
router.get("/:id", getTourController);

router.post("/", createTourController);
router.put("/:id", updateTourController);
router.delete("/:id", deleteTourController);

router.patch("/:id/toggle", toggleTrangThaiController);

export default router;