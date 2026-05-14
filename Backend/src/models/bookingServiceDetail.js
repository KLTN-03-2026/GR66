import mongoose from "mongoose";

const serviceDetailSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    tourServiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TourServiceModel",
      required: true,
    },

    dongianguoilonhientai: {
      type: Number,
      default: 0,
    },

    dongiatreemhientai: {
      type: Number,
      default: 0,
    },

    thanhTien: {
      type: Number,
      required: true,
    },
  },
  {
    collection: "bookingDetails",
    timestamps: true,
  }
);

const BookingDetail = mongoose.model(
  "BookingDetail",
  serviceDetailSchema
);

export default BookingDetail;