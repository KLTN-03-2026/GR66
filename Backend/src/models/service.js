import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  serviceTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "serviceType",
    required: true
  },
  tendichvu: {
    type: String,
    required: true
  },
  moTa: {
    type: String,
    required: true
  },
  donVi: {
    type: String,
    required: true
  },
  trangThai: {
    type: String,
    enum: ["Hoạt động", "Ngưng"],
    default: "Ngưng",
  },
}, {
  collection: "services",
  timestamps: true
});

const Service = mongoose.model("Service", serviceSchema);
export default Service;