import ReviewService from "../services/reviewService.js";
import Review from "../models/review.js";

class ReviewController {
  //gửi đánh giá
  static async createReview(req, res) {
    try {
      const userId = req.user._id;

      const review = await ReviewService.createReview(userId, req.body);

      return res.status(201).json({
        success: true,
        message: "Gửi đánh giá thành công",
        data: review,
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || "Lỗi khi gửi đánh giá",
      });
    }
  }
  //lấy tất cả đánh giá
  static async getAllReviews(req, res) {
    try {
      const reviews = await Review.find()
        .populate({
          path: "Users_ID",
          select: "hoten email",
        })
        .populate({
          path: "Tour_Id",
          select: "tenTour",
        })
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách đánh giá thành công",
        data: reviews,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Lỗi khi lấy danh sách đánh giá",
      });
    }
  }
  //xoá đánh giá
  static async deleteReview(req, res) {
    try {
      const { id } = req.params;

      const review = await Review.findByIdAndDelete(id);

      if (!review) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đánh giá",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Xóa đánh giá thành công",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Lỗi khi xóa đánh giá",
      });
    }
  }
}

export default ReviewController;