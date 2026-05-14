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
        scheduleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TourSchedule",
        },

        // trang thai tour
        trangthai: {
            type: String,
            enum: [
                "Chưa xác nhận",
                "Đã xác nhận",
                "Đang diễn ra",
                "Hoàn thành tour",
                "Đã hủy",
            ],
            default: "Chưa xác nhận",
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
            enum: ["Chưa thanh toán", "Đã thanh toán", "Thanh toán thất bại", "Đã hủy", "Hết hạn"],
            default: "Chưa thanh toán",
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
        expireAt: {
            type: Date,
            default: () => new Date(Date.now() + 5 * 60 * 1000), // 15 giây giữ chỗ
            index: true,
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