import ReviewService from "../services/reviewService.js";

class ReviewController {
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
}

export default ReviewController;