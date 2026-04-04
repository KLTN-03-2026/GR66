import express from "express";
import { signupController,loginWithGoogle,loginController, logoutController, forgotPassword, verifyForgotPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signupController) // đang kí với email và mật khẩu
router.post("/login", loginController); // đăng nhập với email và mật khẩu
router.post("/google", loginWithGoogle); // đăng nhập với google
router.post("/logout", logoutController);//đăng xuất
router.post("/forgot-password", forgotPassword); // quên mật khẩu
router.post("/verify-forgot-password", verifyForgotPassword); // xác thực OTP quên mật khẩu

export default router;