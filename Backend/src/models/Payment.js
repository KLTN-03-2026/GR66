// models/Thanhtoan.js
import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    hoadonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },

    phuongthuc: {
      type: String,
      enum: ["tienmat", "momo", "vnpay", "banking"],
      required: true,
    },

    sotien: {
      type: Number,
      required: true,
    },

    noidung: {
      type: String,
    },

    magiaodich: {
      type: String,
    },

    trangthai: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },

    ngaythanhtoan: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "payments",
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", PaymentSchema);
export default Payment;