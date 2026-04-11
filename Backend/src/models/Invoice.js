import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    dattourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
       index: true, //Query nhanh hơn khi join Booking
    },

    trangthai: {
      type: String,
      enum: ["chua_thanhtoan", "da_thanhtoan", "huy"],
      default: "chua_thanhtoan", // tự động điển
    },

    ngaytao: {
      type: Date,
      default: Date.now,   // tự động điền ngày bây giờ
    },

    tongtien: {
      type: Number,
      required: true,
      min: 0
    },
  },
  {
    collection: "invoices",
    timestamps: {
      updatedAt: "thoigiancapnhat",
    },
  }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;