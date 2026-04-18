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

        songuoi: {
            type: Number,
            required: true,
            min: 1,
        },

        ngaydi: {
            type: Date,
            required: true,
        },

        ngayketthuc: {
            type: Date,
        },

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

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;