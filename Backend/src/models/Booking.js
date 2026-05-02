import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        tourId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tour",
            required: true,
        },
        // trang thai tour
        trangthai: {
            type: String,
            enum: [
                "choduyet",
                "daxacnhan",
                "dangdienra",
                "hoanthanh",
                "huy",
            ],
            default: "choduyet",
        },

        ngaydat: {
            type: Date,
            default: Date.now,
        },

        ngaydi: {
            type: Date,
            required: true,
        },

        ngayketthuc: {
            type: Date,
        },

        soluongnguoilon: {
            type: Number,
            default: 0,
        },

        soluongtreem: {
            type: Number,
            default: 0,
        },

        gianguoilonhientai: {
            type: Number,
            default: 0,
        },

        giatreemhientai: {
            type: Number,
            default: 0,
        },

        tongtien: {
            type: Number,
            required: true,
        },
        // trang thai thanh toán
        trangThaiThanhToan: {
            type: String,
            enum: ["chua_thanh_toan", "da_thanh_toan", "thanh_toan_that_bai"],
            default: "chua_thanh_toan",
        },
        maGiaoDich: {
            type: String,
            default: null,
        },
        ngayThanhToan: {
            type: String,
            default: null,
        },
        nganHang: {
            type: String,
            default: null,
        },
        thoigiandat: {
            type: Date,
            default: Date.now,
        },
    },
    {
        collection: "bookings",
        timestamps: {
            updatedAt: "thoigiancapnhat",
        },
    }
);

const Booking =
    mongoose.models.Booking ||
    mongoose.model("Booking", bookingSchema);

export default Booking;