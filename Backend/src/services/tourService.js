import Tour from "../models/Tour.js";
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