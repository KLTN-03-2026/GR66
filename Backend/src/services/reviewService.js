import mongoose from "mongoose";
import Review from "../models/review.js";
import Tour from "../models/Tour.js";

class ReviewService {
  static async createReview(userId, data) {
    const { Tour_ID, Noidung, Sosao } = data;

    if (!Tour_ID || !Sosao) {
      const err = new Error("Thiếu dữ liệu đánh giá");
      err.status = 400;
      throw err;
    }

    if (!mongoose.Types.ObjectId.isValid(Tour_ID)) {
      const err = new Error("Tour_ID không hợp lệ");
      err.status = 400;
      throw err;
    }

    if (Number(Sosao) < 1 || Number(Sosao) > 5) {
      const err = new Error("Số sao phải từ 1 đến 5");
      err.status = 400;
      throw err;
    }

    const tour = await Tour.findById(Tour_ID);
    if (!tour) {
      const err = new Error("Tour không tồn tại");
      err.status = 404;
      throw err;
    }

    const newReview = await Review.create({
      Users_ID: userId,
      Tour_ID,
      Noidung,
      Sosao,
      Ngaydanhgia: new Date(),
    });

    return newReview;
  }
}

export default ReviewService;