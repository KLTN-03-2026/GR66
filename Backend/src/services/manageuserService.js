import Users from "../models/Users.js";

class ManageUserService {
  // 1. Lấy danh sách tất cả tài khoản
  static async getAllUsers() {
    const users = await Users.find().select("-matkhau").sort({ thoigiantao: -1 });
    return users;
  }

  // 2. Lấy chi tiết 1 tài khoản
  static async getUserById(id) {
    const user = await Users.findById(id).select("-matkhau");

    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }

    return user;
  }

  // 3. Cập nhật tài khoản
  static async updateUser(id, data) {
    const user = await Users.findById(id);

    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }

    // chỉ cho sửa những field cần thiết
    user.hoten = data.hoten ?? user.hoten;
    user.email = data.email ?? user.email;
    user.sdt = data.sdt ?? user.sdt;
    user.gioitinh = data.gioitinh ?? user.gioitinh;
    user.diachi = data.diachi ?? user.diachi;
    user.ngaysinh = data.ngaysinh ?? user.ngaysinh;
    user.role = data.role ?? user.role;
    user.trangthai = data.trangthai ?? user.trangthai;

    await user.save();

    return await Users.findById(id).select("-matkhau");
  }

  // 4. Khóa / mở khóa tài khoản
  static async updateUserStatus(id) {
    const user = await Users.findById(id);

    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }

    user.trangthai = !user.trangthai;
    await user.save();

    return user;
  }

  // 5. Xóa tài khoản
  static async deleteUser(id) {
    const user = await Users.findById(id);

    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }

    await Users.findByIdAndDelete(id);

    return true;
  }

  // 6. Thống kê tài khoản
  static async getUserStatistics() {
    const tongTaiKhoan = await Users.countDocuments();
    const taiKhoanHoatDong = await Users.countDocuments({ trangthai: true });
    const taiKhoanDaKhoa = await Users.countDocuments({ trangthai: false });

    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const taiKhoanVuaDangKy = await Users.countDocuments({
      thoigiantao: { $gte: startOfDay },
    });

    return {
      taiKhoanVuaDangKy,
      taiKhoanHoatDong,
      taiKhoanDaKhoa,
      tongTaiKhoan,
    };
  }
}

export default ManageUserService;