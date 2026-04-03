import mongoose from "mongoose";

const dichVuThemSchema = new mongoose.Schema(
  {
    tenDichVu: {
      type: String,
      required: true,
      trim: true,
    },
    thongTinBaoGom: {
      type: String,
      default: "",
      trim: true,
    },
    thongTinKhongBaoGom: {
      type: String,
      default: "",
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

    diaDiemTour: {
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

    chiTietDichVuKemTour: {
      type: String,
      default: "",
      trim: true,
    },

    dieuKhoanDichVu: {
      type: String,
      default: "",
      trim: true,
    },

    dichVuThem: {
      type: [dichVuThemSchema],
      default: [],
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;