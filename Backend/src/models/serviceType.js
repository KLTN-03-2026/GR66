import mongoose from "mongoose";

const serviceTypeSchema = new mongoose.Schema({
    loaidichvu: {
        type: String,
        required: true,
        trim: true  
    }
}, {
    collection: "serviceTypes",
    timestamps: true
});

const serviceType = mongoose.model("serviceType", serviceTypeSchema);
export default serviceType;