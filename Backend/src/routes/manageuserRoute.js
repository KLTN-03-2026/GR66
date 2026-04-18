import express from "express";
import {
  getUserStats,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserStatus,
} from "../controllers/manageuserController.js";

const router = express.Router();

router.get("/stats", getUserStats);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.patch("/:id/status", updateUserStatus);

export default router;