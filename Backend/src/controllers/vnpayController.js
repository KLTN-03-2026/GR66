import vnpayService from "../services/vnpayService.js";
import Service from "../models/service.js";
import Booking from "../models/Booking.js";

class vnpayController {

 // Hiển thị thông tin tour đã đặt
  static async viewBookedTour(req, res) {
    try {
      const { id: bookingId } = req.params;
      if (!bookingId) {
        return res.status(400).json({
          success: false,
          message: "Thiếu bookingId. Vui lòng cung cấp mã đặt tour."
        });
      }

      const booking = await vnpayService.getBookedTourByBookingId(bookingId);
      return res.status(200).json({
        success: true,
        message: "Lấy thông tin tour đã đặt thành công",
        data: booking
      });
    } catch (error) {
      console.error("View booked tour error:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi lấy thông tin tour đã đặt",
        error: error.message
      });
    }
  }

  // thanh toán vnpay
  static async createQR(req, res) {
    try {
      console.log("BODY:", req.body);

      const { bookingId } = req.body || {};

      if (!bookingId) {
        return res.status(400).json({
          message: "Missing bookingId"
        });
      }

      const paymentUrl = await vnpayService.createPaymentUrl(bookingId);

      return res.json({ paymentUrl });

    } catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }
  }
  //kiểm tra thanh toán
 static async checkPaymentVnpay(req, res) {
  try {
    console.log("VNPAY RETURN DATA:", req.query);

    const result = await vnpayService.checkPaymentVnpay(req.query);

    const bookingId = req.query.vnp_TxnRef?.split('_')[0]; // hoặc cách bạn encode trước đó

    if (result.success) {
      return res.redirect(
        `http://localhost:3000/user/payment-success?bookingId=${bookingId}`
      );
    } else {
      return res.redirect(
        `http://localhost:3001/payment-failed?code=${result.responseCode}`
      );
    }

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

  static async paymentSuccess(req, res) {
    try {
      const { bookingId } = req.query; // hoặc req.params tùy flow

      if (!bookingId) {
        return res.status(400).json({ success: false, message: "bookingId is not defined" });
      }

      // Cập nhật trạng thái booking thành "paid"
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { status: "paid", paidAt: new Date() },
        { new: true }
      );

      if (!booking) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Thanh toán thành công!",
        data: booking,
      });

    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

}
export default vnpayController;