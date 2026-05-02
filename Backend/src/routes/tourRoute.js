import express from "express";
import TourController from "../controllers/tourController.js";
import { upload } from "../middlewares/upload_Img.js";

const router = express.Router();

router.get("/", TourController.getAllTours);
router.get("/view/:id", TourController.viewTour);

router.get("/service-types", TourController.getAllServiceTypes);
router.get("/services", TourController.getAllServices);
router.get("/tour-services", TourController.getAllTourServices);

router.post("/create/tours", upload.array("hinhAnh"), TourController.createTour);
router.post("/create/serviceTypes", TourController.createServiceType);
router.post("/create/services", TourController.createService);
router.post("/create/tourService", TourController.createTourService);

router.put("/update/:id", upload.array("hinhAnh"), TourController.updateTour);
router.put("/services/:id", TourController.updateService);
router.put("/tour-services/:id", TourController.updateTourService);

router.delete("/services/:id", TourController.deleteService);
router.delete("/tour-services/:id", TourController.deleteTourService);

// đặt tour
router.post("/book/:id", TourController.bookTour);
//Hiển thị thông tin tour đã đặt
router.get("/bookingDetail/:id", TourController.viewBookedTour);


export default router;