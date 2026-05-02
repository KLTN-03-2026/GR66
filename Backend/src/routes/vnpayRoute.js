import express from "express";
import vnpayController from "../controllers/vnpayController.js";

const router = express.Router();
// tạo link thanh toán VNPay
router.post("/create-qr", vnpayController.createQR);
// VNPay redirect về
router.get("/check-payment-vnpay", vnpayController.checkPaymentVnpay);
// optional
router.get("/payment-success", vnpayController.paymentSuccess);

export default router;