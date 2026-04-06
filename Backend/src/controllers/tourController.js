import TourService from "../services/tourService.js";

class TourController {
  static async getAllTours(req, res) {
    try {
      const tours = await TourService.getAllTours(req.query);

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách tour thành công",
        data: tours,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getTourById(req, res) {
    try {
      const { id } = req.params;
      const tour = await TourService.getTourById(id);

      return res.status(200).json({
        success: true,
        message: "Lấy chi tiết tour thành công",
        data: tour,
      });
    } catch (error) {
      const statusCode = error.message === "Không tìm thấy tour" ? 404 : 500;

      return res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  }


  // tạo tour
  static async createTour(req, res) {
    try {
      let {
        tenTour,
        diaDiem,
        thoiLuong,
        giaNguoiLon,
        giaTreEm,
        mota,
        diemNoiBat,
        loTrinh,
        chitietdichvu,
        dieuKhoanDichVu,
        trangThai,
        tourSchedules,
        services,
      } = req.body;

      const files = req.files;
      const hinhAnh = (req.files || []).map(file => file.filename);

      // convert number
      giaNguoiLon = Number(giaNguoiLon);
      giaTreEm = Number(giaTreEm);

      // parse JSON
      try {
        if (typeof tourSchedules === "string") {
          tourSchedules = JSON.parse(tourSchedules);
        }
        if (typeof services === "string") {
          services = JSON.parse(services);
        }
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Dữ liệu schedules hoặc services không hợp lệ (JSON sai)",
        });
      }

      // validate bắt buộc
      if (!tenTour || !diaDiem || !thoiLuong) {
        return res.status(400).json({
          success: false,
          message: "Thiếu dữ liệu bắt buộc của tour",
        });
      }
      // validate số
      if (
        isNaN(giaNguoiLon) ||
        isNaN(giaTreEm)
      ) {
        return res.status(400).json({
          success: false,
          message: "Giá hoặc thời lượng không hợp lệ",
        });
      }

      if (trangThai && !["Hoạt động", "Ngưng"].includes(trangThai)) {
        return res.status(400).json({
          success: false,
          message: "Trạng thái không hợp lệ",
        });
      }

      const data = {
        tenTour,
        diaDiem,
        hinhAnh,
        thoiLuong,
        giaNguoiLon,
        giaTreEm,
        mota,
        trangThai,
        diemNoiBat,
        loTrinh,
        chitietdichvu,
        dieuKhoanDichVu,
        hinhAnh,
        tourSchedules,
        services,
      };

      const newTour = await TourService.createTour(data);

      return res.status(201).json({
        success: true,
        message: "Thêm tour thành công",
        data: newTour,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async updateTour(req, res) {
    try {
      const { id } = req.params;
      const { trangThai, giaNguoiLon, giaTreEm } = req.body;

      if (trangThai && !["Hoạt động", "Ngưng"].includes(trangThai)) {
        return res.status(400).json({
          success: false,
          message: "Trạng thái chỉ được là 'Hoạt động' hoặc 'Ngưng'",
        });
      }

      if (giaNguoiLon !== undefined && giaNguoiLon < 0) {
        return res.status(400).json({
          success: false,
          message: "Giá người lớn phải lớn hơn hoặc bằng 0",
        });
      }

      if (giaTreEm !== undefined && giaTreEm < 0) {
        return res.status(400).json({
          success: false,
          message: "Giá trẻ em phải lớn hơn hoặc bằng 0",
        });
      }

      const updatedTour = await TourService.updateTour(id, req.body);

      return res.status(200).json({
        success: true,
        message: "Cập nhật tour thành công",
        data: updatedTour,
      });
    } catch (error) {
      const statusCode =
        error.message === "Không tìm thấy tour"
          ? 404
          : error.message === "Mã tour đã tồn tại"
          ? 400
          : 500;

      return res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async deleteTour(req, res) {
    try {
      const { id } = req.params;
      await TourService.deleteTour(id);

      return res.status(200).json({
        success: true,
        message: "Xóa tour thành công",
      });
    } catch (error) {
      const statusCode = error.message === "Không tìm thấy tour" ? 404 : 500;

      return res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async updateTourStatus(req, res) {
    try {
      const { id } = req.params;
      const { trangThai } = req.body;

      if (!trangThai) {
        return res.status(400).json({
          success: false,
          message: "Trạng thái tour là bắt buộc",
        });
      }

      if (!["Hoạt động", "Ngưng"].includes(trangThai)) {
        return res.status(400).json({
          success: false,
          message: "Trạng thái chỉ được là 'Hoạt động' hoặc 'Ngưng'",
        });
      }

      const updatedTour = await TourService.updateTourStatus(id, trangThai);

      return res.status(200).json({
        success: true,
        message: "Cập nhật trạng thái tour thành công",
        data: updatedTour,
      });
    } catch (error) {
      const statusCode = error.message === "Không tìm thấy tour" ? 404 : 500;

      return res.status(statusCode).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default TourController;