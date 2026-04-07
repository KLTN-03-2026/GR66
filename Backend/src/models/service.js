import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  tenDichVu: {
    type: String,
    required: true
  },
  loaiDichVu: {
    type: String
  },
  noiDungBaoGom: {
    type: String
  },
  noiDungKhongBaoGom: {
    type: String
  },
  dieuKhoan: {
    type: String
  },
  giaNguoiLon: {
    type: Number,
    required: true
  },
  giaTreEm: {
    type: Number,
    required: true
  }
}, {
  collection: "services",
  timestamps: true
});

const Service = mongoose.model("Service" , serviceSchema);
export default Service;