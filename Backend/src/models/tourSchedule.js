import mongoose from "mongoose";

const tourScheduleSchema = new mongoose.Schema({
    tourId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tour",
        require: true,
        index: true,
    },
    ngaykhoihanh: {
        type: Date,
        required: true,
        index: true,
    },
    ngayketthuc: {
        type: Date,
        required: true,
        index: true,
    },
    Socho: {
        type: Number,
        required: true,
        index: true,
    },
    Conlai: {
        type: Number,
        required: true,
        index: true,
    },
}, {
    collection: "tourSchedules",
    timestamps: true
});
const TourSchedule = mongoose.model("TourSchedule", tourScheduleSchema);
export default TourSchedule;