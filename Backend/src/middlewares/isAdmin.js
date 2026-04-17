export const isAdmin = async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Bạn chưa đăng nhập",
        });
      }
  
      if (req.user.role !== "Admin") {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền truy cập",
        });
      }
  
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Lỗi phân quyền",
      });
    }
  };