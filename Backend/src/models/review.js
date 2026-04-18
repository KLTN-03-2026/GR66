import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    Users_ID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    Tour_ID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },

    Noidung: {
      type: String,
      trim: true,
    },

    Sosao: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    Ngaydanhgia: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "reviews",
    timestamps: true,
  }
);

const Review = mongoose.model("Review", reviewSchema)
export default Review;