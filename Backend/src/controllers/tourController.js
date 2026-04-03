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

  static async createTour(req, res) {
    try {
      const {
        maTour,
        tenTour,
        diaDiemTour,
        thoiLuong,
        giaNguoiLon,
        giaTreEm,
        trangThai,
      } = req.body;

      if (
        !maTour ||
        !tenTour ||
        !diaDiemTour ||
        !thoiLuong ||
        giaNguoiLon === undefined ||
        giaTreEm === undefined
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Mã tour, tên tour, địa điểm tour, thời lượng, giá người lớn và giá trẻ em là bắt buộc",
        });
      }

      if (trangThai && !["Hoạt động", "Ngưng"].includes(trangThai)) {
        return res.status(400).json({
          success: false,
          message: "Trạng thái chỉ được là 'Hoạt động' hoặc 'Ngưng'",
        });
      }

      const newTour = await TourService.createTour(req.body);

      return res.status(201).json({
        success: true,
        message: "Thêm tour thành công",
        data: newTour,
      });
    } catch (error) {
      const statusCode = error.message === "Mã tour đã tồn tại" ? 400 : 500;

      return res.status(statusCode).json({
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