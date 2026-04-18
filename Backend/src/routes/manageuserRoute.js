import express from "express";
import ManageUserController from "../controllers/manageuserController.js";
import { ProtectedRoute } from "../middlewares/ProtectedRoute.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.get("/statistics", ProtectedRoute, isAdmin, ManageUserController.getUserStatistics);
router.get("/", ProtectedRoute, isAdmin, ManageUserController.getAllUsers);
router.get("/:id", ProtectedRoute, isAdmin, ManageUserController.getUserById);
router.put("/:id", ProtectedRoute, isAdmin, ManageUserController.updateUser);
router.patch("/:id/status", ProtectedRoute, isAdmin, ManageUserController.updateUserStatus);
router.delete("/:id", ProtectedRoute, isAdmin, ManageUserController.deleteUser);

export default router;