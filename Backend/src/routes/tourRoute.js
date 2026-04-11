import express from "express";
import TourController from "../controllers/tourController.js";
import { upload } from "../middlewares/upload_Img.js";

const router = express.Router();

router.get("/", TourController.getAllTours);
//router.post("/create", TourController.createTour); // tạo tour
router.post('/create',upload.array('hinhAnh'), TourController.createTour) // upload lấy từ mdw upload_img.js | upload.array thêm nhiều ảnh nếu muốn thêm 11 ảnh sử dụng single
router.get("/:id", TourController.getTourById);
router.put("/:id", TourController.updateTour);
router.delete("/:id", TourController.deleteTour);
router.patch("/:id/status", TourController.updateTourStatus);



export default router;