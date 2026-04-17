import Tour from "../models/Tour.js";
import TourSchedule from "../models/tourSchedule.js";
import Service from "../models/service.js";
import TourServiceModel from "../models/tourService.js"; //Rename để tránh trùng với tên class bản chất nó là tour dịch vụ
import mongoose from "mongoose";
import TourPrice from "../models/TourPrice.js";
import serviceType from "../models/serviceType.js";

class TourService {

  //TẠO TOUR
  static async createTour(data) {
    if (!data.tenTour) {
      throw new Error("Thiếu dữ liệu bắt buộc");
    }
    const session = await mongoose.startSession(); // tạo một sesion làm việc với mongoose
    session.startTransaction(); //Bắt đầu một transaction nhiều lệnh database sẽ được coi như 1 gói
    //debug
    console.log("FULL BODY:", data);
    console.log("TourService input:", data.TourServiceModel);
    //code chính
    try {
      // thêm tour
      const maTour = "TOUR" + Date.now();
      const newTour = await Tour.create([{
        maTour,
        tenTour: data.tenTour,
        diaDiem: data.diaDiem,
        hinhAnh: data.hinhAnh,
        thoiLuong: data.thoiLuong,
        mota: data.mota,
        diemNoiBat: data.diemNoiBat,
        loTrinh: data.loTrinh,
        chitiettour: data.chitiettour,
        dieuKhoan: data.dieuKhoan,
        trangThai: data.trangThai,
      }], { session });  // session ở đây mục đích gom tất cả các db thành 1 gói

      // Tạo lịch tour
      let schedules = [];  // tạo mảng rỗng
      if (data.tourSchedules && data.tourSchedules.length > 0) {  // kiểm tra có tour du lịch hay khỗng và có ít nhất 1 mảng rỗng
        schedules = await TourSchedule.insertMany(  //  lưu dữ liệu vào bảng TourSchedule vào mảng schedules insertMany() dùng để thêm nhiều document cùng lúc vào collection.
          data.tourSchedules.map(item => ({ // map() duyệt qua từng phần tử , Mỗi item sẽ được chuyển thành một object mới để lưu vào DB.
            tourId: newTour[0]._id,
            ngaykhoihanh: item.ngaykhoihanh,
            ngayketthuc: item.ngayketthuc,
            Socho: item.Socho,
            Conlai: item.Socho,
          })), { session }
        );
      } else {
        schedules = [];  // nếu không có lịch thì trả lại mảng rỗng
      }

      
      // tạo giá tour
      let tourPrices = null;
      if (data.tourPrices) {
        tourPrices = await TourPrice.create([
          {
            tourId: newTour[0]._id,
            giaNguoiLon: data.tourPrices.giaNguoiLon,
            giaTreEm: data.tourPrices.giaTreEm
          }], { session }
        )
      }

      data.tourServices.forEach((item, index) => {
        if (item.giaNguoiLon == null || item.giaNguoiLon === "") {
          throw new Error(`Thiếu giá người lớn tại dịch vụ ${index}`);
        }

        if (item.giaTreEm == null || item.giaTreEm === "") {
          throw new Error(`Thiếu giá trẻ em tại dịch vụ ${index}`);
        }
      });

      // tạo gói dịch vụ
      let tourServices = [];
      if (data.tourServices && data.tourServices.length > 0) {
        // Query tất cả dịch vụ gốc 1 lần thay vì query từng cái trong vòng lặp
        const dichvuIds = data.tourServices.map(item => item.dichvuId);  // Lấy ra danh sách dichvuId từ mảng tourServices
        const dichvuList = await Service.find(
          {
            _id: { $in: dichvuIds }// lấy tất cả dịch vụ có id nằm trong mảng // %in toán tử của mongo = nằm trong danh sách
          }).session(session);

        // Chuyển thành object để tìm kiếm nhanh theo id
        const dichvuMap = {};
        for (let i = 0; i < dichvuList.length; i++) {
          const dichvu = dichvuList[i]// lấy từng dịch vụ
          const id = dichvu.id.toString(); // lấy id
          dichvuMap[id] = dichvu; // gán vào object
        }
        tourServices = await TourServiceModel.insertMany(
          data.tourServices.map(item => {
            const dichvu = dichvuMap[item.dichvuId.toString()];
            if (!dichvu) throw new Error(`Không tìm thấy dịch vụ: ${item.dichvuId}`);
            return {
              tourId: newTour[0]._id,
              dichvuId: item.dichvuId,
              tenDichVuApDung: item.tenDichVuApDung || dichvu.tendichvu,
              giaApDungNguoiLon: Number(item.giaNguoiLon),
              giaApDungTreEm: Number(item.giaTreEm),
              noiDungDichVuBaoGom: item.noiDungDichVuBaoGom || dichvu.noiDungDichVuBaoGom,
              noiDungDichVuKhongBaoGom: item.noiDungDichVuKhongBaoGom || dichvu.noiDungDichVuKhongBaoGom,
              dieuKhoan:
                item.dieuKhoan || dichvu.dieuKhoan
            };
          }),
          { session }
        );
      }
      //commit 
      await session.commitTransaction(); // tạp hợp các gói lại với nhau
      session.endSession(); // kết thúc sesion
      console.log(await TourPrice.find({}));
      return {
        tour: newTour[0],       // Dùng newTour thay vì fullTour chưa khai báo
        schedules,
        tourPrices,
        tourServices
      };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }
  // tạo loại dịch vụ
  static async createServiceType(data) {
    try {
      const newServiceType = await serviceType.create({
        loaidichvu: data.loaidichvu.trim()
      });

      return {
        newServiceType
      }
    } catch (err) {
      console.log(err)
    }
  }
  // tạo gói dịch vụ chung cho toàn hệ thống ( quản lí gói dịch vụ)
  static async createService(data) {
    if (!data.tendichvu || !data.tendichvu.trim()) {
      throw new Error("Tên dịch vụ không hợp lệ");
    }
    if (!data.serviceTypeId) {
      throw new Error("Thiếu loại dịch vụ");
    }
    try {
      const newService = await Service.create({
        serviceTypeId: data.serviceTypeId,
        tendichvu: data.tendichvu,
        moTa: data.moTa,
        donVi: data.donVi,
        trangThai: data.trangThai
      });
      return newService;
    } catch (err) {
      console.log(err);
      throw new Error("Lỗi khi tạo dịch vụ");
    }
  }


  // Hiển thị tất cả các tour
  static async getTourDetail(id) {
    //Lấy tour chính
    const tour = await Tour.findById(id);
    if (!tour) {
      throw new Error("Không tìm thấy tour");
    }
    const tourId = tour._id;
    //Lấy lịch trình
    const schedules = await TourSchedule.find({ tourId });
    //Lấy giá tour
    const tourPrices = await TourPrice.find({ tourId });
    
    //Lấy dịch vụ
    const tourServices = await TourServiceModel.find({ tourId });
    // Trả về gộp tất cả
    return {
      tour,
      schedules,
      tourPrices,
      tourServices,
    };
  }

}
export default TourService; 