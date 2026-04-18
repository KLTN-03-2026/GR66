// models/CTHoadon.js
import mongoose from "mongoose";

const InvoiceDetailSchema = new mongoose.Schema(
  {
    hoadonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },
    dongia: {
      type: Number,
      required: true,
    },

    soluong: {
      type: Number,
      required: true,
      min: 1,
    },

    thanhtien: {
      type: Number,
      required: true,
    },

    ngaytao: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "invoiceDetails",
    timestamps: true,
  }
);

const InvoiceDetail = mongoose.model("InvoiceDetail", InvoiceDetailSchema);
export default InvoiceDetail;