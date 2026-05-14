import mongoose from "mongoose";

const serviceDetailSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
 
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    adultQuantity: {
      type: Number,
      default: 0,
    },

    childQuantity: {
      type: Number,
      default: 0,
    },

    unitPrice: {
      type: Number,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    collection: "serviceDetails",
    timestamps: true,
  }
);

const ServiceDetail = mongoose.model("ServiceDetail", serviceDetailSchema);
export default ServiceDetail