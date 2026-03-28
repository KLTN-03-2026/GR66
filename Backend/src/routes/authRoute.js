import express from "express";
import { signupController } from "../controllers/authController.js";
import {
    getToursController,
    getTourController,
    createTourController,
    updateTourController,
    deleteTourController,
    searchTourController,
    toggleTrangThaiController
} from "../controllers/authController.js";


const router = express.Router();

router.post("/signup", signupController)

// ===== TOUR =====
router.get("/tours/search", searchTourController);

router.get("/tours", getToursController);
router.get("/tours/:id", getTourController);
router.post("/tours", createTourController);
router.put("/tours/:id", updateTourController);
router.delete("/tours/:id", deleteTourController);

router.patch("/tours/:id/toggle", toggleTrangThaiController);

export default router;


