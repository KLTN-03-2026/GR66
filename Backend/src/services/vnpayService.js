import Service from "../models/service.js";
import TourServiceModel from "../models/tourService.js"; //Rename để tránh trùng với tên class bản chất nó là tour dịch vụ
import mongoose from "mongoose";
import { VNPay, ProductCode, VnpLocale, dateFormat, ignoreLogger } from "vnpay";
import Booking from "../models/booking.js";

class vnpayService  {
static async createPaymentUrl(bookingId) {
    const findBooking = await Booking.findById(bookingId);
    if (!findBooking) throw new Error("Không tìm thấy booking");

    const vnPay = new VNPay({
      tmnCode: '4YFOOE49',
      secureSecret: '1E7XXN7K1EU4I9QKX4LP1034I5TZDCR1',
      vnpayHost: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
      testMode: true,
      hashAlgorithm: 'SHA512',
      loggerFn: ignoreLogger,
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const vnpayResponse = await vnPay.buildPaymentUrl({
      vnp_Amount: findBooking.tongtien,
      vnp_IpAddr: '127.0.0.1',
      vnp_TxnRef: `${findBooking._id}_${Date.now()}`,
      vnp_OrderInfo: `${findBooking._id}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: 'http://localhost:3001/api/vnpay/check-payment-vnpay',
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
      vnp_ExpireDate: dateFormat(tomorrow),
    });

    return vnpayResponse;
  }
  
  // response vnpay
  static async checkPaymentVnpay(query) {
    try {
      const {
        vnp_ResponseCode,
        vnp_TxnRef,
        vnp_Amount,
        vnp_TransactionNo,
        vnp_BankCode,
        vnp_PayDate,
      } = query;

      console.log("VNPAY QUERY:", query);

      const bookingId = vnp_TxnRef.split('_')[0];

      const findBooking = await Booking.findById(bookingId);
      if (!findBooking) throw new Error("Không tìm thấy booking");

      if (vnp_ResponseCode === '00') {
        await Booking.findByIdAndUpdate(bookingId, {
          trangThaiThanhToan: 'da_thanh_toan',
          maGiaoDich: vnp_TransactionNo,
          ngayThanhToan: vnp_PayDate,
          nganHang: vnp_BankCode,
        });

        return {
          success: true,
          message: "Thanh toán thành công",
          data: {
            bookingId,
            soTien: vnp_Amount / 100,
            maGiaoDich: vnp_TransactionNo,
            nganHang: vnp_BankCode,
            ngayThanhToan: vnp_PayDate,
          },
        };
      } else {
        await Booking.findByIdAndUpdate(bookingId, {
          trangThaiThanhToan: 'thanh_toan_that_bai',
        });

        return {
          success: false,
          message: "Thanh toán thất bại",
          responseCode: vnp_ResponseCode,
        };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

}

export default vnpayService