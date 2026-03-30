import express from "express";
import { signupController,loginWithGoogle,loginController } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signupController)
router.post("/login", loginController);
router.post("/google", loginWithGoogle);

export default router;