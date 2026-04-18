import jwt from "jsonwebtoken";
import Users from "../models/Users.js";

export const ProtectedRoute = async (req, res, next) => {
  try {
    // lấy token từ header
    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy token, vui lòng đăng nhập",
      });
    }

    // xác thực token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedUser) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Access Token hết hạn hoặc không hợp lệ",
        });
      }

      // tìm user theo id
      const user = await Users.findById(decodedUser.userId).select("-matkhau");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User không tồn tại",
        });
      }

      // gắn user vào request
      req.user = user;

      next();
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi xác thực người dùng",
    });
  }
};