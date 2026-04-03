import Tour from "../models/Tour.js";

class TourService {
  static async getAllTours(query = {}) {
    const filter = {};

    if (query.keyword) {
      filter.$or = [
        { maTour: { $regex: query.keyword, $options: "i" } },
        { tenTour: { $regex: query.keyword, $options: "i" } },
        { diaDiemTour: { $regex: query.keyword, $options: "i" } },
      ];
    }

    if (query.trangThai) {
      filter.trangThai = query.trangThai;
    }

    return await Tour.find(filter).sort({ createdAt: -1 });
  }

  static async getTourById(id) {
    const tour = await Tour.findById(id);

    if (!tour) {
      throw new Error("Không tìm thấy tour");
    }

    return tour;
  }

  static async createTour(data) {
    const existedTour = await Tour.findOne({ maTour: data.maTour });

    if (existedTour) {
      throw new Error("Mã tour đã tồn tại");
    }

    const newTour = await Tour.create({
      maTour: data.maTour,
      tenTour: data.tenTour,
      diaDiemTour: data.diaDiemTour,
      hinhAnh: Array.isArray(data.hinhAnh) ? data.hinhAnh : [],
      thoiLuong: data.thoiLuong,
      giaNguoiLon: data.giaNguoiLon,
      giaTreEm: data.giaTreEm,
      diemNoiBat: data.diemNoiBat || "",
      loTrinh: data.loTrinh || "",
      chiTietDichVuKemTour: data.chiTietDichVuKemTour || "",
      dieuKhoanDichVu: data.dieuKhoanDichVu || "",
      ngayKhoiHanh: data.ngayKhoiHanh || null,
      ngayKetThuc: data.ngayKetThuc || null,
      trangThai: data.trangThai || "Ngưng",
      dichVuThem: Array.isArray(data.dichVuThem) ? data.dichVuThem : [],
    });

    return newTour;
  }

  static async updateTour(id, data) {
    const currentTour = await Tour.findById(id);

    if (!currentTour) {
      throw new Error("Không tìm thấy tour");
    }

    if (data.maTour && data.maTour !== currentTour.maTour) {
      const existedTour = await Tour.findOne({ maTour: data.maTour });

      if (existedTour) {
        throw new Error("Mã tour đã tồn tại");
      }
    }

    const updatedTour = await Tour.findByIdAndUpdate(
      id,
      {
        $set: {
          maTour: data.maTour ?? currentTour.maTour,
          tenTour: data.tenTour ?? currentTour.tenTour,
          diaDiemTour: data.diaDiemTour ?? currentTour.diaDiemTour,
          hinhAnh: Array.isArray(data.hinhAnh)
            ? data.hinhAnh
            : currentTour.hinhAnh,
          thoiLuong: data.thoiLuong ?? currentTour.thoiLuong,
          giaNguoiLon: data.giaNguoiLon ?? currentTour.giaNguoiLon,
          giaTreEm: data.giaTreEm ?? currentTour.giaTreEm,
          diemNoiBat: data.diemNoiBat ?? currentTour.diemNoiBat,
          loTrinh: data.loTrinh ?? currentTour.loTrinh,
          chiTietDichVuKemTour:
            data.chiTietDichVuKemTour ?? currentTour.chiTietDichVuKemTour,
          dieuKhoanDichVu:
            data.dieuKhoanDichVu ?? currentTour.dieuKhoanDichVu,
          ngayKhoiHanh:
            data.ngayKhoiHanh !== undefined
              ? data.ngayKhoiHanh
              : currentTour.ngayKhoiHanh,
          ngayKetThuc:
            data.ngayKetThuc !== undefined
              ? data.ngayKetThuc
              : currentTour.ngayKetThuc,
          trangThai: data.trangThai ?? currentTour.trangThai,
          dichVuThem: Array.isArray(data.dichVuThem)
            ? data.dichVuThem
            : currentTour.dichVuThem,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return updatedTour;
  }

  static async deleteTour(id) {
    const deletedTour = await Tour.findByIdAndDelete(id);

    if (!deletedTour) {
      throw new Error("Không tìm thấy tour");
    }

    return deletedTour;
  }

  static async updateTourStatus(id, trangThai) {
    const updatedTour = await Tour.findByIdAndUpdate(
      id,
      { trangThai },
      { new: true, runValidators: true }
    );

    if (!updatedTour) {
      throw new Error("Không tìm thấy tour");
    }

    return updatedTour;
  }
}

export default TourService;