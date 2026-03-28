import express from "express";
import { signupController,loginWithGoogle } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signupController)
router.post("/google", loginWithGoogle);
export default router;