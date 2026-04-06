import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    tenTour: {
      type: String,
      required: true,
      trim: true,
    },
    diaDiem: {
      type: String,
      required: true,
      trim: true,
    },
    hinhAnh: {
      type: [String],
      default: [],
    },
    thoiLuong: {
      type: String,
      required: true,
      trim: true,
    },
    giaNguoiLon: {
      type: Number,
      required: true,
      min: 0,
    },

    giaTreEm: {
      type: Number,
      required: true,
      min: 0,
    },
    mota: {
      type: String,
      require: true,
      trim: true,
    },
    diemNoiBat: {
      type: String,
      default: "",
      trim: true,
    },

    loTrinh: {
      type: String,
      default: "",
      trim: true,
    },

    chitietdichvu: {
      type: String,
      default: "",
      trim: true,
    },

    dieuKhoanDichVu: {
      type: String,
      default: "",
      trim: true,
    },
    trangThai: {
      type: String,
      enum: ["Hoạt động", "Ngưng"],
      default: "Ngưng",
    },
  },
  {
    collection: "tours",
    timestamps: true,
  }
);

const Tour = mongoose.model("Tour", tourSchema);
export default Tour;