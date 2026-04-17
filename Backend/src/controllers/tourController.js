import TourSchedule from "../models/tourSchedule.js";
import TourService from "../services/tourService.js";
import Service from "../models/service.js";
import Tour from "../models/Tour.js";

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
      const data = req.body;

      data.hinhAnh = req.files
        ? req.files.map(file => file.path)
        : [];
      // Validate input cơ bản
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          message: "Dữ liệu tour không được để trống",
        });
      }
      const tour = await TourService.createTour(req.body);
      return res.status(201).json({
        message: "Tạo tour thành công",
        data: tour,
      });

    } catch (error) {
      console.error(error);

      // dữ liệu nhập vào  không hợp lệ
      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Dữ liệu không hợp lệ",
          error: error.message,
        });
      }
      return res.status(500).json({
        message: "Lỗi tạo tour 1",
        error: error.message,
      });
    }
  }
  // tạo loại dịch vụ 
  static async createServiceType(req, res) {
    try {
      const serviceType = await TourService.createServiceType(req.body);
      return res.status(201).json({
        message: "tạo loại dịch vụ thành công",
        data: serviceType
      })
    } catch (err) {
      console.error(err);
      // dữ liệu nhập vào  không hợp lệ
      if (err.name === "ValidationError") {
        return res.status(400).json({
          message: "Dữ liệu không hợp lệ",
          error: err.message,
        });
      }
      return res.status(500).json({
        message: "Lỗi tạo tour",
        error: err.message,
      });
    }
  }
  //tạo dịch vụ 
  static async createService(req, res){
    try{
        // Validate input cơ bản
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          message: "Dữ liệu tour không được để trống",
        });
      }

      // tạo dịch vụ đẩy logic qua file services
      const service = await TourService.createService(req.body);

      return res.status(201).json({
        message: "Tạo dịch vụ thành công",
        data: service,
      });
    } catch (err) {
      console.error(err);
      // dữ liệu nhập vào  không hợp lệ
      if (err.name === "ValidationError") {
        return res.status(400).json({
          message: "Dữ liệu không hợp lệ",
          error: err.message,
        });
      }
      return res.status(500).json({
        message: "Lỗi tạo dịch vụ",
        error: err.message,
      });
    }
  }
  //tạo dịch vụ cho từng tour
  static async createTourService(req, res){
    try{
        // Validate input cơ bản
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          message: "Dữ liệu tour không được để trống",
        });
      }

      // tạo dịch vụ đẩy logic qua file services
      const tourService = await TourService.createTourService(req.body);

      return res.status(201).json({
        message: "Tạo dịch vụ thành công",
        data: tourService,
      });
    } catch (err) {
      console.error(err);
      // dữ liệu nhập vào  không hợp lệ
      if (err.name === "ValidationError") {
        return res.status(400).json({
          message: "Dữ liệu không hợp lệ",
          error: err.message,
        });
      }
      return res.status(500).json({
        message: "Lỗi tạo dịch vụ cho từng tour",
        error: err.message,
      });
    }
  }
  //Hiển thị các tour
  static async viewTour(req, res) {
    try {
      const tour = await TourService.getTourDetail(req.params.id);

      return res.json({
        success: true,
        data: tour,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
}

export default TourController;