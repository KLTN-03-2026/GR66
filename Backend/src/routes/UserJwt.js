import express from "express";
import { authMe } from "../controllers/authController.js";
import { ProtetedRoute } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get("/me", ProtetedRoute, authMe) 

export default router;