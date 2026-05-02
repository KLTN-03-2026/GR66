import mongoose from "mongoose";

const tourServiceschema = new mongoose.Schema({
    tourId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tour",
        required: true,
        index: true,
    },
    dichvuId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
        index: true,
    },   
    tenDichVuApDung: {
        type: String,
        required: true, // bắt buộc phải cso dữ liệu

    },
    giaApDungNguoiLon: {
        type: Number,
        min: 0,
        required: true, // bắt buộc phải cso dữ liệu
        
    },
    giaApDungTreEm: {
        type: Number,
        min: 0,
        required: true, // bắt buộc phải cso dữ liệu
    },
    noiDungDichVuBaoGom: {
        type: String,
        default: ""
    },
    noiDungDichVuKhongBaoGom: {
        type: String,
        default: ""
    },
    dieuKhoan: {
        type: String,
        default: ""
    }
}, {
    collection: "tourServices",
    timestamps: true
});


const TourServiceModel = mongoose.model("TourServiceModel", tourServiceschema);
export default TourServiceModel