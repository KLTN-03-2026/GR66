import Tour from "../models/Tour.js";
import TourSchedule from "../models/tourSchedule.js";
import Service from "../models/service.js";
import TourServiceModel from "../models/tourService.js"; //Rename để tránh trùng với tên class bản chất nó là tour dịch vụ
import mongoose from "mongoose";
import TourPrice from "../models/TourPrice.js";
import serviceType from "../models/serviceType.js";
import Review from "../models/review.js";
import Booking from "../models/booking.js";
import BookingDetail from "../models/bookingServiceDetail.js";


class TourService {

  // Tạo tour mới, bao gồm cả tour chính, lịch trình, giá tour và dịch vụ tour
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
        hinhAnh: Array.isArray(data.hinhAnh) ? data.hinhAnh : [],
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
    if (!data.loaidichvu) {
      throw new Error("Loại dịch vụ không được để trống");
    }

    const newServiceType = await serviceType.create({
      loaidichvu: data.loaidichvu.trim(),
    });

    return newServiceType;
  } catch (err) {
    console.log(err);
    throw err;
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

  // Hiển thị thông tin cần thiết trong chức năng đặt tour
  static async getTourDetail(id) {
    try {
      const tour = await Tour.findById(id);
      if (!tour) throw new Error("Không tìm thấy tour");

      const tourId = tour._id;
      const schedules = await TourSchedule.find({ tourId });
      const tourPrices = await TourPrice.find({ tourId });

      const tourServices = await TourServiceModel.find({ tourId }).populate({
        path: 'dichvuId',
        model: 'Service',
        populate: {
          path: 'serviceTypeId',
          model: 'serviceType'
        }
      });

      const reviews = await Review.find({ Tour_Id: tourId }).populate({
        path: "Users_ID",
        select: "hoten email"
      });

      return { tour, schedules, tourPrices, tourServices, reviews };

    } catch (err) {
      console.error("getTourDetail error:", err);
      throw err;
    }
  }

  // Hiển thị danh sách tour ngoài giao diện
  static async getAllTours() {
    const tours = await Tour.find().sort({ createdAt: -1 });
    const result = await Promise.all(
      tours.map(async (tour) => {
        // lấy 1 giá tour
        const tourPrice = await TourPrice.findOne({ tourId: tour._id });
        // lấy lịch khởi hành gần nhất
        const schedule = await TourSchedule.findOne({ tourId: tour._id })
          .sort({ ngaydi: 1 });
        return {
          _id: tour._id,
          diaDiem: tour.diaDiem,
          tenTour: tour.tenTour,
          hinhAnh: tour.hinhAnh,
          giaTour: tourPrice ? tourPrice.giaNguoiLon : 0,
          ngaydi: schedule ? schedule.ngaydi : null,
          trangThai: tour.trangThai,
        };
      })
    );
    return result;
  }





  // cập nhật tour
  static async updateTour(id, data) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const tour = await Tour.findById(id).session(session);

      if (!tour) {
        throw new Error("Không tìm thấy tour");
      }

      // cập nhật bảng Tour
      tour.tenTour = data.tenTour ?? tour.tenTour;
      tour.diaDiem = data.diaDiem ?? tour.diaDiem;
      tour.thoiLuong = data.thoiLuong ?? tour.thoiLuong;
      tour.mota = data.mota ?? tour.mota;
      tour.diemNoiBat = data.diemNoiBat ?? tour.diemNoiBat;
      tour.loTrinh = data.loTrinh ?? tour.loTrinh;
      tour.chitiettour = data.chitiettour ?? tour.chitiettour;
      tour.dieuKhoan = data.dieuKhoan ?? tour.dieuKhoan;
      tour.trangThai = data.trangThai ?? tour.trangThai;

      // cập nhật ảnh nếu có
      // thêm ảnh mới nhưng vẫn giữ ảnh cũ
      // cập nhật ảnh: ảnh nào FE đã xoá thì xoá khỏi MongoDB
      if (Array.isArray(data.existingImages)) {
        tour.hinhAnh = data.existingImages;
      }

      // thêm ảnh mới vào danh sách ảnh còn lại
      if (data.hinhAnh && Array.isArray(data.hinhAnh) && data.hinhAnh.length > 0) {
        tour.hinhAnh = [
          ...(Array.isArray(tour.hinhAnh) ? tour.hinhAnh : []),
          ...data.hinhAnh,
        ];
      }

      await tour.save({ session });

      // cập nhật bảng giá
      if (data.tourPrices) {
        let tourPrice = await TourPrice.findOne({ tourId: id }).session(session);

        if (tourPrice) {
          tourPrice.giaNguoiLon = data.tourPrices.giaNguoiLon ?? tourPrice.giaNguoiLon;
          tourPrice.giaTreEm = data.tourPrices.giaTreEm ?? tourPrice.giaTreEm;
          await tourPrice.save({ session });
        } else {
          await TourPrice.create(
            [
              {
                tourId: id,
                giaNguoiLon: data.tourPrices.giaNguoiLon,
                giaTreEm: data.tourPrices.giaTreEm,
              },
            ],
            { session }
          );
        }
      }
      // chỉ cập nhật lịch khi FE thật sự gửi tourSchedules
      if (data.tourSchedules && Array.isArray(data.tourSchedules)) {
        await TourSchedule.deleteMany({ tourId: id }, { session });

        if (data.tourSchedules.length > 0) {
          await TourSchedule.insertMany(
            data.tourSchedules.map((item) => ({
              tourId: id,
              ngaykhoihanh: item.ngaykhoihanh,
              ngayketthuc: item.ngayketthuc,
              Socho: item.Socho,
              Conlai: item.Conlai ?? item.Socho,
            })),
            { session }
          );
        }
      }

      // cập nhật dịch vụ
      if (data.tourServices && Array.isArray(data.tourServices)) {
        await TourServiceModel.deleteMany({ tourId: id }, { session });

        if (data.tourServices.length > 0) {
          const dichvuIds = data.tourServices.map((item) => item.dichvuId);

          const dichvuList = await Service.find({
            _id: { $in: dichvuIds },
          }).session(session);

          const dichvuMap = {};
          for (let dv of dichvuList) {
            dichvuMap[dv._id.toString()] = dv;
          }

          const newTourServices = data.tourServices.map((item) => {
            const dichvu = dichvuMap[item.dichvuId.toString()];
            if (!dichvu) {
              throw new Error(`Không tìm thấy dịch vụ: ${item.dichvuId}`);
            }

            return {
              tourId: id,
              dichvuId: item.dichvuId,
              tenDichVuApDung: item.tenDichVuApDung || dichvu.tendichvu,
              giaApDungNguoiLon: Number(item.giaNguoiLon),
              giaApDungTreEm: Number(item.giaTreEm),
              noiDungDichVuBaoGom:
                item.noiDungDichVuBaoGom || dichvu.noiDungDichVuBaoGom,
              noiDungDichVuKhongBaoGom:
                item.noiDungDichVuKhongBaoGom || dichvu.noiDungDichVuKhongBaoGom,
              dieuKhoan: item.dieuKhoan || dichvu.dieuKhoan,
            };
          });

          await TourServiceModel.insertMany(newTourServices, { session });
        }
      }

      await session.commitTransaction();
      session.endSession();

      return await this.getTourDetail(id);

    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }




  static async getAllServiceTypes() {
    return await serviceType.find().sort({ createdAt: -1 });
  }


  static async getAllServiceTypes() {
    return await serviceType.find().sort({ createdAt: -1 });
  }

  static async getAllServices() {
    return await Service.find()
      .populate("serviceTypeId")
      .sort({ createdAt: -1 });
  }

  static async getAllTourServices(query = {}) {
    const filter = {};

    if (query.tourId) {
      filter.tourId = query.tourId;
    }

    return await TourServiceModel.find(filter)
      .populate({
        path: "dichvuId",
        model: "Service",
        populate: {
          path: "serviceTypeId",
          model: "serviceType",
        },
      })
      .populate("tourId")
      .sort({ createdAt: -1 });
  }

  static async createTourService(data) {
    if (!data.tourId) {
      throw new Error("Thiếu tourId");
    }

    if (!data.dichvuId) {
      throw new Error("Thiếu dichvuId");
    }

    const dichvu = await Service.findById(data.dichvuId);

    if (!dichvu) {
      throw new Error("Không tìm thấy dịch vụ gốc");
    }

    const existed = await TourServiceModel.findOne({
      tourId: data.tourId,
      dichvuId: data.dichvuId,
    });

    if (existed) {
      throw new Error("Tour này đã có dịch vụ này");
    }

    return await TourServiceModel.create({
      tourId: data.tourId,
      dichvuId: data.dichvuId,
      tenDichVuApDung: data.tenDichVuApDung || dichvu.tendichvu,
      giaApDungNguoiLon: Number(data.giaApDungNguoiLon ?? data.giaNguoiLon ?? 0),
      giaApDungTreEm: Number(data.giaApDungTreEm ?? data.giaTreEm ?? 0),
      noiDungDichVuBaoGom: data.noiDungDichVuBaoGom || dichvu.moTa || "",
      noiDungDichVuKhongBaoGom: data.noiDungDichVuKhongBaoGom || "",
      dieuKhoan: data.dieuKhoan || "",
    });
  }

  static async updateService(id, data) {
    const service = await Service.findById(id);

    if (!service) {
      throw new Error("Không tìm thấy dịch vụ");
    }

    service.serviceTypeId = data.serviceTypeId ?? service.serviceTypeId;
    service.tendichvu = data.tendichvu ?? service.tendichvu;
    service.moTa = data.moTa ?? service.moTa;
    service.donVi = data.donVi ?? service.donVi;
    service.trangThai = data.trangThai ?? service.trangThai;

    await service.save();

    return service;
  }

  static async updateTourService(id, data) {
    const tourService = await TourServiceModel.findById(id);

    if (!tourService) {
      throw new Error("Không tìm thấy dịch vụ theo tour");
    }

    tourService.tenDichVuApDung =
      data.tenDichVuApDung ?? tourService.tenDichVuApDung;

    tourService.giaApDungNguoiLon = Number(
      data.giaApDungNguoiLon ?? data.giaNguoiLon ?? tourService.giaApDungNguoiLon
    );

    tourService.giaApDungTreEm = Number(
      data.giaApDungTreEm ?? data.giaTreEm ?? tourService.giaApDungTreEm
    );

    tourService.noiDungDichVuBaoGom =
      data.noiDungDichVuBaoGom ?? tourService.noiDungDichVuBaoGom;

    tourService.noiDungDichVuKhongBaoGom =
      data.noiDungDichVuKhongBaoGom ?? tourService.noiDungDichVuKhongBaoGom;

    tourService.dieuKhoan = data.dieuKhoan ?? tourService.dieuKhoan;

    await tourService.save();

    return tourService;
  }

  static async deleteService(id) {
    const used = await TourServiceModel.findOne({ dichvuId: id });

    if (used) {
      throw new Error(
        "Dịch vụ này đang được dùng trong tourServices. Hãy đổi trạng thái sang Ngưng thay vì xóa."
      );
    }

    return await Service.findByIdAndDelete(id);
  }

  static async deleteTourService(id) {
    return await TourServiceModel.findByIdAndDelete(id);
  }

  // chức năng đặt tour sẽ cần lấy lại thông tin tour sau khi cập nhật nên trả về luôn
  static async bookTour(data) {
    if (!data.userId) throw new Error("Thiếu userId");
    if (!data.tourId) throw new Error("Thiếu tourId");

    // Kiểm tra tour tồn tại
    const tour = await Tour.findById(data.tourId);
    if (!tour) throw new Error("Tour không tồn tại");

    // Chuẩn hoá tourServiceIds
    const tourServiceIds = Array.isArray(data.tourServiceIds)
      ? data.tourServiceIds
      : [];

    // Kiểm tra các dịch vụ tồn tại
    const tourServices = await TourServiceModel.find({
      _id: { $in: tourServiceIds },
    });
    if (tourServiceIds.length > 0 && tourServices.length !== tourServiceIds.length) {
      throw new Error("Một hoặc nhiều dịch vụ tour không tồn tại");
    }
    const soLuongNguoiLon = data.soluongnguoilon || 0;
    const soLuongTreEm = data.soluongtreem || 0;
    const tongSoNguoi = soLuongNguoiLon + soLuongTreEm;
    // Tính tổng tiền dịch vụ từ các service được chọn
    let tongTienDichVu = 0;
    const serviceDetails = tourServices.map((service) => {
      const thanhTien =
        soLuongNguoiLon * (service.giaApDungNguoiLon || 0) +
        soLuongTreEm * (service.giaApDungTreEm || 0);
      tongTienDichVu += thanhTien;
      return {
        tourServiceId: service._id,
        dongianguoilonhientai: service.giaApDungNguoiLon || 0,
        dongiatreemhientai: service.giaApDungTreEm || 0,
        thanhTien,
      };
    });

    const tourPrice = await TourPrice.findOne({ tourId: data.tourId });
    if (!tourPrice) throw new Error("Không tìm thấy giá tour");

    const tongTien =
      soLuongNguoiLon * tourPrice.giaNguoiLon +
      soLuongTreEm * tourPrice.giaTreEm +
      tongTienDichVu;

    const ngaydat = data.ngaydat ? new Date(data.ngaydat) : new Date();
    if (isNaN(ngaydat.getTime())) throw new Error("Ngày đặt không hợp lệ");

    const expireAt = new Date(Date.now() + 15 * 60 * 1000); // 15 phút

    const session = await mongoose.startSession();
    session.startTransaction();
    let committed = false;

    try {
      const existingPending = await Booking.findOne({
        userId: data.userId,
        tourId: data.tourId,
        trangThaiThanhToan: "Chưa thanh toán",
        expireAt: { $gt: new Date() },
      }).session(session);

      if (existingPending) {
        const secondsLeft = Math.floor((existingPending.expireAt - Date.now()) / 1000);
        throw new Error(
          `PENDING_BOOKING:${existingPending._id}:${secondsLeft}`
        );
      }

      const schedule = await TourSchedule.findOne({
        tourId: data.tourId,
        ngaykhoihanh: data.ngaydi,
      }).session(session);
      if (!schedule) throw new Error("Không tìm thấy lịch khởi hành");

      if (schedule.Conlai < tongSoNguoi) throw new Error("Không đủ chỗ trong tour");

      schedule.Conlai -= tongSoNguoi;
      await schedule.save({ session });

      const newBooking = await Booking.create(
        [{
          userId: data.userId,
          tourId: data.tourId,
          scheduleId: schedule._id,
          trangthai: "Chưa xác nhận",
          soluongnguoilon: soLuongNguoiLon,
          soluongtreem: soLuongTreEm,
          gianguoilonhientai: tourPrice.giaNguoiLon,
          giatreemhientai: tourPrice.giaTreEm,
          tongtien: tongTien,
          ngaydat,
          ngaydi: data.ngaydi,
          expireAt,
        }],
        { session }
      );

      const createdDetails = serviceDetails.length > 0
        ? await BookingDetail.insertMany(
          serviceDetails.map((sd) => ({ bookingId: newBooking[0]._id, ...sd })),
          { session }
        )
        : [];

      await session.commitTransaction();
      committed = true;

      return {
        booking: { ...newBooking[0].toObject(), expireAt },
        serviceDetails: createdDetails,
      };

    } catch (err) {
      if (!committed) await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

  // BookingService.js
  static async checkPendingBooking(userId, tourId) {
    const pending = await Booking.findOne({
      userId,
      tourId,
      trangThaiThanhToan: "Chưa thanh toán",
      expireAt: { $gt: new Date() },
    });

    if (!pending) return { hasPending: false };

    const secondsLeft = Math.floor((pending.expireAt - Date.now()) / 1000);

    return {
      hasPending: true,
      bookingId: pending._id,
      tongtien: pending.tongtien,
      ngaydi: pending.ngaydi,
      secondsLeft,
    };
  }

  // Hủy
  static async cancelPendingBooking(bookingId, userId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const booking = await Booking.findOne({
        _id: bookingId,
        userId,
        trangThaiThanhToan: "Chưa thanh toán",
      }).session(session);

      if (!booking) throw new Error("Không tìm thấy booking");

      await Booking.updateOne(
        { _id: bookingId },
        { $set: { trangThaiThanhToan: "Đã hủy" } },
        { session }
      );

      // Hoàn trả chỗ
      const totalPeople =
        (booking.soluongnguoilon || 0) + (booking.soluongtreem || 0);

      await TourSchedule.updateOne(
        { _id: booking.scheduleId },
        { $inc: { Conlai: totalPeople } },
        { session }
      );

      await session.commitTransaction();
      return { success: true };
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }


  // Hiển thị thông tin tour đã đặt
  static async getBookedTourByBookingId(bookingId) {
    //Tìm một booking theo bookingId Lấy thêm dữ liệu liên kết từ bảng Tour và TourSchedule Trả về object JavaScript thuần bằng .lean()
    const booking = await Booking.findById(bookingId)
      .populate({
        path: "tourId",
        model: "Tour",
        select: "tenTour diaDiem hinhAnh",
      })
      .populate({
        path: "scheduleId",
        model: "TourSchedule",
        select: "ngaykhoihanh ngayketthuc",
      })
      .lean();
    console.log("BOOKING:", booking);

    if (!booking) return null;

    const bookingDetails = await BookingDetail.find({ bookingId: booking._id })
      .populate({
        path: "tourServiceId",
        model: "TourServiceModel",
        populate: {
          path: "dichvuId",
          model: "Service",
          select: "ngaykhoihanh ngayketthuc",
        },
      });

    return {
      bookingId: booking._id,
      tour: booking.tourId,
      trangThai: booking.trangthai,
      ngaydat: booking.ngaydat ?? null,
      ngaydi: booking.scheduleId?.ngaykhoihanh ?? null,
      ngayketthuc: booking.scheduleId?.ngayketthuc ?? null,
      soLuong: {
        nguoiLon: booking.soluongnguoilon,
        treEm: booking.soluongtreem,
      },
      giaCurrent: {
        nguoiLon: booking.gianguoilonhientai,
        treEm: booking.giatreemhientai,
      },
      tongTien: booking.tongtien,
      dichVu: bookingDetails.map((detail) => ({
        detailId: detail._id,
        tenDichVu: detail.tourServiceId?.tenDichVuApDung ?? null,
        donGia: {
          nguoiLon: detail.dongianguoilonhientai,
          treEm: detail.dongiatreemhientai,
        },
        thanhTien: detail.thanhTien,
      })),
      thoiGianCapNhat: booking.thoigiancapnhat ?? null,
      trangThaiThanhToan: booking.trangThaiThanhToan,
      maGiaoDich: booking.maGiaoDich,
      nganHang: booking.nganHang,
      ngayThanhToan: booking.ngayThanhToan,
    };
  }

  // services/bookingService.js
  static async getAllBookedTours() {
    const bookings = await Booking.find()
      .populate({
        path: "userId",       
        model: "User",         // đổi đúng tên model User của bạn
        select: "hoten email sdt", 
      })
      .populate({
        path: "tourId",
        model: "Tour",
      })
      .populate({
        path: "scheduleId",
        model: "TourSchedule",
      })
      .lean();

    const result = await Promise.all(
      bookings.map(async (booking) => {
        const bookingDetails = await BookingDetail.find({
          bookingId: booking._id,
        }).populate({
          path: "tourServiceId",
          model: "TourServiceModel",
          populate: {
            path: "dichvuId",
            model: "Service",
          },
        });

        return {
          ...booking,
          bookingDetails,
        };
      })
    );

    return result;
  }

  static async cancelBooking(bookingId, userId) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const booking = await Booking.findOne({
        _id: bookingId,
        userId,
        trangthai: { $in: ["Chưa xác nhận", "Đã xác nhận"] },
      }).session(session);

      if (!booking) throw new Error("Không thể hủy booking này");

      await Booking.updateOne(
        { _id: bookingId },
        { $set: { trangthai: "Đã hủy", trangThaiThanhToan: "Đã hủy" } },
        { session }
      );

      const totalPeople =
        (booking.soluongnguoilon || 0) + (booking.soluongtreem || 0);
      await TourSchedule.updateOne(
        { _id: booking.scheduleId },
        { $inc: { Conlai: totalPeople } },
        { session }
      );

      await session.commitTransaction();
      return { success: true };
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

}
export default TourService; 
