import express from "express";
import { authMe, UpdateProfileController } from "../controllers/userController.js";
import { ProtetedRoute } from "../middlewares/authMiddlewares.js";

const router = express.Router();

// GET: Lấy thông tin người dùng
router.get("/me", ProtetedRoute, authMe);
console.log("User route loaded");

// PUT: Cập nhật thông tin cá nhân
router.put("/me", ProtetedRoute, UpdateProfileController);

export default router;