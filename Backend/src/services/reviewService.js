import mongoose from "mongoose";
import Review from "../models/review.js";
import Tour from "../models/Tour.js";

class ReviewService {
  static async createReview(userId, data) {
    if (!data) {
      const err = new Error("Request body bị thiếu");
      err.status = 400;
      throw err;
    }
    const { Tour_Id, Noidung, Sosao } = data;

    if (!Tour_Id || !Sosao) {
      const err = new Error("Thiếu dữ liệu đánh giá");
      err.status = 400;
      throw err;
    }

    if (!mongoose.Types.ObjectId.isValid(Tour_Id)) {
      const err = new Error("Tour_Id không hợp lệ");
      err.status = 400;
      throw err;
    }

    if (Number(Sosao) < 1 || Number(Sosao) > 5) {
      const err = new Error("Số sao phải từ 1 đến 5");
      err.status = 400;
      throw err;
    }

    const tour = await Tour.findById(Tour_Id);
    if (!tour) {
      const err = new Error("Tour không tồn tại");
      err.status = 404;
      throw err;
    }

    const newReview = await Review.create({
      Users_ID: data.Users_ID,  // Nhập Id từ client
      Tour_Id,
      Noidung,
      Sosao,
      Ngaydanhgia: new Date(),
    });


    const review = await Review.findById(newReview._id)
      .populate({
        path: "Users_ID",
        select: "hoten email"
      });
    console.log("AFTER POPULATE:", review);
    return review;
  }
}

export default ReviewService;