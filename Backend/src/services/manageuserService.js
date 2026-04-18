import bcrypt from "bcrypt";
import Users from "../models/users.js";

// Thống kê tài khoản
export const getUserStatsService = async () => {
  const now = new Date();

  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );

  const [tongSoTaiKhoan, taiKhoanHoatDong, taiKhoanDaKhoa, taiKhoanMoi] =
    await Promise.all([
      Users.countDocuments(),
      Users.countDocuments({ trangthai: true }),
      Users.countDocuments({ trangthai: false }),
      Users.countDocuments({
        thoigiantao: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      }),
    ]);

  return {
    tongSoTaiKhoan,
    taiKhoanHoatDong,
    taiKhoanDaKhoa,
    taiKhoanMoi,
  };
};

// Lấy danh sách tài khoản + tìm kiếm + lọc + phân trang
export const getAllUsersService = async (query) => {
  const {
    page = 1,
    limit = 10,
    keyword = "",
    role = "",
    trangthai = "",
  } = query;

  const filter = {};

  if (keyword) {
    filter.$or = [
      { hoten: { $regex: keyword, $options: "i" } },
      { email: { $regex: keyword, $options: "i" } },
      { sdt: { $regex: keyword, $options: "i" } },
      { diachi: { $regex: keyword, $options: "i" } },
    ];
  }

  if (role) {
    filter.role = role;
  }

  if (trangthai !== "") {
    filter.trangthai = trangthai === "true";
  }

  const currentPage = Number(page);
  const pageSize = Number(limit);
  const skip = (currentPage - 1) * pageSize;

  const [users, total] = await Promise.all([
    Users.find(filter)
      .select("-matkhau")
      .sort({ thoigiantao: -1 })
      .skip(skip)
      .limit(pageSize),
    Users.countDocuments(filter),
  ]);

  return {
    data: users,
    pagination: {
      page: currentPage,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};

// Lấy chi tiết 1 tài khoản
export const getUserByIdService = async (id) => {
  const user = await Users.findById(id).select("-matkhau");

  if (!user) {
    const err = new Error("Không tìm thấy tài khoản");
    err.status = 404;
    throw err;
  }

  return user;
};

// Tạo tài khoản mới
export const createUserService = async (data) => {
  const {
    role,
    hoten,
    email,
    matkhau,
    sdt,
    gioitinh,
    diachi,
    ngaysinh,
  } = data;

  if (!hoten || !email || !matkhau) {
    const err = new Error("Thiếu dữ liệu bắt buộc");
    err.status = 400;
    throw err;
  }

  if (role && role !== "Admin" && role !== "Khach") {
    const err = new Error("Role chỉ được là Admin hoặc Khach");
    err.status = 400;
    throw err;
  }

  const existUser = await Users.findOne({ email });
  if (existUser) {
    const err = new Error("Email đã tồn tại");
    err.status = 409;
    throw err;
  }

  const hashPassword = await bcrypt.hash(matkhau, 10);

  const newUser = await Users.create({
    role: role || "Khach",
    hoten,
    email,
    matkhau: hashPassword,
    sdt,
    gioitinh,
    diachi,
    ngaysinh,
    trangthai: true,
  });

  return await Users.findById(newUser._id).select("-matkhau");
};

// Cập nhật tài khoản
export const updateUserService = async (id, data) => {
  const { role, hoten, sdt, gioitinh, diachi, ngaysinh } = data;

  const user = await Users.findById(id);
  if (!user) {
    const err = new Error("Không tìm thấy tài khoản");
    err.status = 404;
    throw err;
  }

  if (role !== undefined) {
    if (role !== "Admin" && role !== "Khach") {
      const err = new Error("Role chỉ được là Admin hoặc Khach");
      err.status = 400;
      throw err;
    }
    user.role = role;
  }

  if (hoten !== undefined) user.hoten = hoten;
  if (sdt !== undefined) user.sdt = sdt;
  if (gioitinh !== undefined) user.gioitinh = gioitinh;
  if (diachi !== undefined) user.diachi = diachi;
  if (ngaysinh !== undefined) user.ngaysinh = ngaysinh;

  await user.save();

  return await Users.findById(id).select("-matkhau");
};

// Khóa / mở khóa tài khoản
export const updateUserStatusService = async (id, trangthai) => {
  const user = await Users.findById(id);

  if (!user) {
    const err = new Error("Không tìm thấy tài khoản");
    err.status = 404;
    throw err;
  }

  user.trangthai = trangthai;
  await user.save();

  return await Users.findById(id).select("-matkhau");
};