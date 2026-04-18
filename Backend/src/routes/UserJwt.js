import express from "express";
import { authMe } from "../controllers/authController.js";
import { ProtetedRoute } from "../middlewares/authMiddlewares.js";

const router = express.Router();

<<<<<<< HEAD
router.get("/me", ProtetedRoute, authMe) 
=======
router.get("/me", ProtetedRoute, authMe) // dùng khi muốn chặn truy cập API nếu user chưa đăng nhập hoặc token không hợp lệ.
>>>>>>> master

export default router;