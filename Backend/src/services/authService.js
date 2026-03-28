import bcrypt from 'bcrypt';
import User from '../models/Users.js';
import Tour from "../models/Tour.js";

export const signUpService = async (data) => {
    const { role, hoten, email, matkhau, sdt, gioitinh, diachi } = data;
    if (!role || !hoten || !email || !matkhau || !sdt || !gioitinh || !diachi) {
        throw new Error("Thiếu dữ liệu nhập vào")
    }
    const duplicate = await User.findOne({ email })

    if (duplicate) {
        throw new Error("Email đã tồn tại")
    }
    // mã hóa mật khẩu
    const hashPassword = await bcrypt.hash(matkhau, 10); // salt = 10 2^10 số lần trộn
    // tạo user mới
    const newUser = await User.create({
        role,
        hoten,
        email,
        matkhau: hashPassword,
        sdt,
        gioitinh,
        diachi
    })
    // return 
    return newUser;
}


// quản lý tour
// Lấy danh sách + phân trang
export const getTours = async (page = 1, limit = 5) => {
    const skip = (page - 1) * limit;
  
    const tours = await Tour.find()
      .skip(skip)
      .limit(limit)
      .sort({ thoigiantao: -1 });
  
    const total = await Tour.countDocuments();
  
    return {
      tours,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  };
  
  // Lấy 1 tour
  export const getTourById = async (id) => {
    return await Tour.findById(id);
  };
  
  // Tạo tour
  export const createTour = async (data) => {
    return await Tour.create(data);
  };
  
  // Cập nhật tour
  export const updateTour = async (id, data) => {
    return await Tour.findByIdAndUpdate(id, data, { new: true });
  };
  
  // Xoá tour
  export const deleteTour = async (id) => {
    return await Tour.findByIdAndDelete(id);
  };
  
  // Tìm kiếm
  export const searchTour = async (keyword) => {
    return await Tour.find({
      tentour: { $regex: keyword, $options: "i" },
    });
  };
  
  // Khoá / mở khoá
  export const toggleTrangThai = async (id) => {
    const tour = await Tour.findById(id);
  
    if (!tour) {
      throw new Error("Tour không tồn tại");
    }
  
    tour.trangthai = !tour.trangthai;
    return await tour.save();
  };