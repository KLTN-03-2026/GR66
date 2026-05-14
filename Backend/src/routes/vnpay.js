import express from "express";
import vnpayController from "../controllers/vnpayController.js";

const router = express.Router();

// tạo link thanh toán
router.post("/create-qr", vnpayController.createQR);
// VNPay redirect về (return URL)
router.get("/check-payment-vnpay", vnpayController.checkPaymentVnpay);
// optional: success page API
router.get("/payment-success", vnpayController.paymentSuccess);

export default router;