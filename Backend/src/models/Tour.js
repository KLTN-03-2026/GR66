import mongoose from "mongoose";

const dichVuThemSchema = new mongoose.Schema(
  {
    tenDichVu: {
      type: String,
      required: true,
      trim: true,
    },
    thongTin: {
      type: String,
      default: "",
      trim: true,
    },
    gia: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: true,
  }
);

const tourSchema = new mongoose.Schema(
  {
    maTour: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    tenTour: {
      type: String,
      required: true,
      trim: true,
    },
    thoiLuong: {
      type: String,
      required: true,
      trim: true,
    },
    gia: {
      type: Number,
      required: true,
      min: 0,
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
    chiTietDichVu: {
      type: String,
      default: "",
      trim: true,
    },
    dieuKhoan: {
      type: String,
      default: "",
      trim: true,
    },
    hinhAnh: {
      type: String,
      default: "",
      trim: true,
    },
    ngayKhoiHanh: {
      type: Date,
      default: null,
    },
    ngayKetThuc: {
      type: Date,
      default: null,
    },
    trangThai: {
      type: String,
      enum: ["Hoạt động", "Ngưng"],
      default: "Ngưng",
    },
    dichVuThem: {
      type: [dichVuThemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;