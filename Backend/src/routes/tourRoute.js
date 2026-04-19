import express from "express";
import TourController from "../controllers/tourController.js";
import { upload } from "../middlewares/upload_Img.js";

const router = express.Router();



router.get("/", TourController.getAllTours);
// tạo tour
router.post('/create/tours',upload.array('hinhAnh'), TourController.createTour) // upload lấy từ mdw upload_img.js | upload.array thêm nhiều ảnh nếu muốn thêm 11 ảnh sử dụng single
// tạo loại dịch vụ
router.post('/create/serviceTypes', TourController.createServiceType)
// tạo dịch vụ 
router.post('/create/services', TourController.createService )
// tạo gói dịch vụ cho từng loại tour
router.post('/create/tourService', TourController.createTourService)
//Hiển thị các thông tin tour
router.get("/view/:id", TourController.viewTour);   



export default router;