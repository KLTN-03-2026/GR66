import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    matour: {
      type: String,
      trim: true,
    },

    tentour: {
      type: String,
      required: true,
      trim: true,
    },

    hinhanh: {
      type: String,
    },

    mota: {
      type: String,
    },

    diadiem: {
      type: String,
    },

    gia: {
      type: Number,
      required: true,
    },

    thoigian: {
      type: String, // ví dụ: 2 ngày 1 đêm
    },

    ngayketthuc: {
      type: Date,
    },

    trangthai: {
      type: Boolean,
      default: true, // true = hoạt động, false = ngưng
    },
  },
  {
    timestamps: {
      createdAt: "thoigiantao",
      updatedAt: "thoigiancapnhat",
    },
  }
);

const Tour = mongoose.model("Tours", tourSchema);

export default Tour;