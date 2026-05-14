import express from "express";
import ManageUserController from "../controllers/manageuserController.js";


const router = express.Router();

router.get("/statistics", ManageUserController.getUserStatistics);
router.get("/", ManageUserController.getAllUsers);
router.get("/:id", ManageUserController.getUserById);
router.put("/:id", ManageUserController.updateUser);
router.delete("/:id", ManageUserController.deleteUser);

export default router;