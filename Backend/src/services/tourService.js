import Tour from "../models/Tour.js";
import TourSchedule from "../models/tourSchedule.js";
import Service from "../models/service.js";
import TourServiceModel from "../models/tourService.js"; //Rename để tránh trùng với tên class bản chất nó là tour dịch vụ


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

  //Tạo tour
  static async createTour(data) {
    //debug
    console.log("FULL BODY:", data);
    console.log("TourService input:", data.TourServiceModel);
    //code chính
    // thêm tour
    const newTour = await Tour.create({
      tenTour: data.tenTour,
      diaDiem: data.diaDiem,
      hinhAnh: data.hinhAnh,
      thoiLuong: data.thoiLuong,
      giaNguoiLon: data.giaNguoiLon,
      giaTreEm: data.giaTreEm,
      mota: data.mota,
      diemNoiBat: data.diemNoiBat,
      loTrinh: data.loTrinh,
      chitietdichvu: data.chitietdichvu,
      dieuKhoanDichVu: data.dieuKhoanDichVu,
      trangThai: data.trangThai,
    });
    // Tạo lịch tour
    let schedules = [];  // tạo mảng rỗng
    if (data.tourSchedules && data.tourSchedules.length > 0) {  // kiểm tra có tour du lịch hay khỗng và có ít nhất 1 mảng rỗng
      schedules = await TourSchedule.insertMany(  //  lưu dữ liệu vào bảng TourSchedule vào mảng schedules insertMany() dùng để thêm nhiều document cùng lúc vào collection.
        data.tourSchedules.map(item => ({ // map() duyệt qua từng phần tử , Mỗi item sẽ được chuyển thành một object mới để lưu vào DB.
          ngaykhoihanh: item.ngaykhoihanh,
          ngayketthuc: item.ngayketthuc,
          Socho: item.Socho,
          Conlai: item.Socho,
        }))
      );
    }else{
      schedules = [];  // nếu không có lịch thì trả lại mảng rỗng
    } 
    // Tạo  dịch vụ trong bảng Dichvu
    let services = [];
    if (data.services?.length > 0) {
      for (const serviceData of data.services || []) // lặp qua danh sách khi nhập dữ liệu
      {
        let newService = await Service.findOne({ // khai báo để tìm tên dv và loại dv  
          tenDichVu: serviceData.tenDichVu,
          loaiDichVu: serviceData.loaiDichVu,
        });
        if (!newService) {  // nếu khác khai báo thì tạo mới dịch vụ sau đó tạo dịch vụ
          newService = await Service.create({
            tenDichVu: serviceData.tenDichVu,
            loaiDichVu: serviceData.loaiDichVu,
            noiDungBaoGom: serviceData.noiDungBaoGom,
            noiDungKhongBaoGom: serviceData.noiDungKhongBaoGom,
            dieuKhoan: serviceData.dieuKhoan,
            giaNguoiLon: serviceData.giaNguoiLon ?? 0,
            giaTreEm: serviceData.giaTreEm ?? 0,
          });
        }
        // tạo chức năng trong bảng tour_dichvu
        const createdTourService = await TourServiceModel.create({  // tạo vào model TourServiceModel
          tourId: newTour._id,
          dichvuId: newService._id,
          giaapdungnguoilon: serviceData.giaapdungnguoilon ?? newService.giaNguoiLon,
          giaapdungtreem: serviceData.giaapdungtreem ?? newService.giaTreEm,
        });
        services.push(createdTourService); //Gom vào mảng
      }
    }
    return {
      tour: newTour,       // Dùng newTour thay vì fullTour chưa khai báo
      schedules,           // Đã khai báo bên ngoài vòng lặp
      services,            // Đã khai báo bên ngoài vòng lặp
    };
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