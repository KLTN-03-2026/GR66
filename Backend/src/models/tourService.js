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
    giaapdungnguoilon: {
        type: Number,
        default: 0, // Nếu bạn không truyền giá trị cho field đó, thì nó sẽ tự động nhận giá trị 0.
    },
    giaapdungtreem: {
        type: Number,
        default: 0,
    }
}, {
    collection: "tourServices",
    timestamps: true
});


const TourServiceModel = mongoose.model("TourServiceModel", tourServiceschema);
export default TourServiceModel