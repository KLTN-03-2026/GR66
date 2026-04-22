import express from "express";
import { signupController,loginWithGoogle,loginController, logoutController } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signupController) // đang kí với email và mật khẩu
router.post("/login", loginController); // đăng nhập với email và mật khẩu
router.post("/google", loginWithGoogle); // đăng nhập với google
router.post("/logout", logoutController);//đăng xuất


export default router;
