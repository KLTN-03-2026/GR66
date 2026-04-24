import mongoose from "mongoose";

const tourPriceSchme = new mongoose.Schema({
    tourId: {
        type: mongoose.Schema.ObjectId,
        ref: "Tour",
        required: true
    },
    giaNguoiLon: {
        type: Number,
        required: true,
        min: 0
    },
    giaTreEm: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    collection: "tourPrices",
    timestamps: true
})

const TourPrice = mongoose.model("TourPrice", tourPriceSchme);
export default TourPrice;

