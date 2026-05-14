import ManageUserService from "../services/manageuserService.js";

class ManageUserController {
  // 1. Lấy danh sách tài khoản
  static async getAllUsers(req, res) {
    try {
      const users = await ManageUserService.getAllUsers();

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách tài khoản thành công",
        data: users,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  // 2. Lấy chi tiết tài khoản
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await ManageUserService.getUserById(id);

      return res.status(200).json({
        success: true,
        message: "Lấy chi tiết tài khoản thành công",
        data: user,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 3. Cập nhật tài khoản
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const user = await ManageUserService.updateUser(id, req.body);

      return res.status(200).json({
        success: true,
        message: "Cập nhật tài khoản thành công",
        data: user,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

 

  // 5. Xóa tài khoản
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await ManageUserService.deleteUser(id);

      return res.status(200).json({
        success: true,
        message: "Xóa tài khoản thành công",
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // 6. Lấy thống kê tài khoản
  static async getUserStatistics(req, res) {
    try {
      const statistics = await ManageUserService.getUserStatistics();

      return res.status(200).json({
        success: true,
        message: "Lấy thống kê tài khoản thành công",
        data: statistics,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default ManageUserController;