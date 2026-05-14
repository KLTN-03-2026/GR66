import mongoose from "mongoose";
import Review from "../models/review.js";
import Tour from "../models/Tour.js";
import User from "../models/Users.js";

class ReviewService {
  static async createReview(userId, data) {
    if (!data) {
      const err = new Error("Request body bị thiếu");
      err.status = 400;
      throw err;
    }

    const { Users_ID, Tour_Id, Noidung, Sosao } = data;

    if (!Users_ID || !Tour_Id || !Sosao) {
      const err = new Error("Thiếu dữ liệu đánh giá");
      err.status = 400;
      throw err;
    }

    if (!mongoose.Types.ObjectId.isValid(Users_ID)) {
      const err = new Error("Users_ID không hợp lệ");
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

    // ✅ check tour
    const tour = await Tour.findById(Tour_Id);
    if (!tour) {
      const err = new Error("Tour không tồn tại");
      err.status = 404;
      throw err;
    }

    // 🔥 LẤY USER TỪ DB
    const user = await User.findById(Users_ID).select("hoten email");

    if (!user) {
      const err = new Error("User không tồn tại");
      err.status = 404;
      throw err;
    }

    // 🔥 TẠO REVIEW (GÁN NAME + EMAIL)
    const newReview = await Review.create({
      Users_ID,
      User_Name: user.hoten || "",
      User_Email: user.email || "",
      Tour_Id,
      Noidung,
      Sosao: Number(Sosao),
      Ngaydanhgia: new Date(),
    });

    // 🔥 populate để trả về đẹp
    const review = await Review.findById(newReview._id)
      .populate({
        path: "Users_ID",
        select: "hoten email",
      })
      .populate({
        path: "Tour_Id",
        select: "tenTour",
      });

    return review;
  }
}

export default ReviewService;