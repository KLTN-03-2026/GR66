import TourSchedule from "../models/tourSchedule.js";
import TourService from "../services/tourService.js";
import Service from "../models/service.js";
import Tour from "../models/Tour.js";
import Booking from "../models/Booking.js";

function parseJsonField(data, field) {
  if (data[field] && typeof data[field] === "string") {
    data[field] = JSON.parse(data[field]);
  }
}

class TourController {
  static async getAllTours(req, res) {
    try {
      const tours = await TourService.getAllTours();

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

  static async getAllServiceTypes(req, res) {
    try {
      const data = await TourService.getAllServiceTypes();

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách loại dịch vụ thành công",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getAllServices(req, res) {
    try {
      const data = await TourService.getAllServices();

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách dịch vụ thành công",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getAllTourServices(req, res) {
    try {
      const data = await TourService.getAllTourServices(req.query);

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách dịch vụ theo tour thành công",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async createTour(req, res) {
    try {
      const data = { ...req.body };

      parseJsonField(data, "tourPrices");
      parseJsonField(data, "tourSchedules");
      parseJsonField(data, "tourServices");

      data.hinhAnh = req.files ? req.files.map((file) => file.filename) : [];

      if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({
          success: false,
          message: "Dữ liệu tour không được để trống",
        });
      }

      const tour = await TourService.createTour(data);

      return res.status(201).json({
        success: true,
        message: "Tạo tour thành công",
        data: tour,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Lỗi tạo tour",
        error: error.message,
      });
    }
  }

  static async createServiceType(req, res) {
    try {
      const data = await TourService.createServiceType(req.body);

      return res.status(201).json({
        success: true,
        message: "Tạo loại dịch vụ thành công",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Lỗi tạo loại dịch vụ",
        error: error.message,
      });
    }
  }

  static async createService(req, res) {
    try {
      const data = await TourService.createService(req.body);

      return res.status(201).json({
        success: true,
        message: "Tạo dịch vụ thành công",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Lỗi tạo dịch vụ",
        error: error.message,
      });
    }
  }

  static async createTourService(req, res) {
    try {
      const data = await TourService.createTourService(req.body);

      return res.status(201).json({
        success: true,
        message: "Tạo dịch vụ cho tour thành công",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Lỗi tạo dịch vụ cho từng tour",
        error: error.message,
      });
    }
  }

  static async viewTour(req, res) {
    try {
      const data = await TourService.getTourDetail(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Lấy chi tiết tour thành công",
        data,
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
      const data = { ...req.body };

      parseJsonField(data, "tourPrices");
      parseJsonField(data, "tourSchedules");
      parseJsonField(data, "tourServices");

      if (req.files && req.files.length > 0) {
        data.hinhAnh = req.files.map((file) => file.filename);
      }

      const updatedTour = await TourService.updateTour(id, data);

      return res.status(200).json({
        success: true,
        message: "Cập nhật tour thành công",
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

  static async updateService(req, res) {
    try {
      const data = await TourService.updateService(req.params.id, req.body);

      return res.status(200).json({
        success: true,
        message: "Cập nhật dịch vụ thành công",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async updateTourService(req, res) {
    try {
      const data = await TourService.updateTourService(req.params.id, req.body);

      return res.status(200).json({
        success: true,
        message: "Cập nhật dịch vụ theo tour thành công",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async deleteService(req, res) {
    try {
      const data = await TourService.deleteService(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Xóa dịch vụ thành công",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  static async deleteTourService(req, res) {
    try {
      const data = await TourService.deleteTourService(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Xóa dịch vụ khỏi tour thành công",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  // ĐẶT TOUR - Controller
  static async bookTour(req, res) {
    try {
      console.log("PARAMS:", req.params);
      console.log("BODY:", req.body);
      // Kiểm tra req.body có tồn tại không
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          success: false,
          message: "Dữ liệu gửi lên không được để trống",
        });
      }
      // id tour lấy từ params
      const { id: tourId } = req.params;
      const {
        userId,
        soluongnguoilon = 0,
        soluongtreem = 0,
        tourServiceIds = [],
        ngaydi,
      } = req.body;

      // Validation rõ ràng
      if (!tourId) {
        return res.status(400).json({ success: false, message: "Thiếu tourId" });
      }

      if (!userId) {
        return res.status(400).json({ success: false, message: "Thiếu userId. Vui lòng đăng nhập để đặt tour." });
      }
      // Thêm validate ngaydi
      if (!ngaydi) {
        return res.status(400).json({ success: false, message: "Thiếu ngày đi" });
      }

      const parsedNgayDi = new Date(ngaydi);
      if (isNaN(parsedNgayDi.getTime())) {
        return res.status(400).json({ success: false, message: "Ngày đi không hợp lệ" });
      }

      // Chuẩn bị dữ liệu
      const bookingData = {
        userId,
        tourId,
        soluongnguoilon: Number(soluongnguoilon),
        soluongtreem: Number(soluongtreem),
        tourServiceIds: Array.isArray(tourServiceIds) ? tourServiceIds : [],
        ngaydi: parsedNgayDi, //dùng biến đã validate
      };

      const result = await TourService.bookTour(bookingData);

      return res.status(201).json({
        success: true,
        message: "Đặt tour thành công",
        data: result
      });

    } catch (error) {
      console.error("Book tour error:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi đặt tour",
        error: error.message
      });
    }
  }

  // Hiển thị thông tin tour đã đặt
  static async viewBookedTour(req, res) {
    try {
      const { id: bookingId } = req.params;
      if (!bookingId) {
        return res.status(400).json({
          success: false,
          message: "Thiếu bookingId. Vui lòng cung cấp mã đặt tour."
        });
      }

      const booking = await TourService.getBookedTourByBookingId(bookingId);
      return res.status(200).json({
        success: true,
        message: "Lấy thông tin tour đã đặt thành công",
        data: booking
      });
    } catch (error) {
      console.error("View booked tour error:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi lấy thông tin tour đã đặt",
        error: error.message
      });
    }
  }

}

export default TourController;