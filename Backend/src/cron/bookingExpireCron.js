import cron from "node-cron";
import mongoose from "mongoose";
import Booking from "../models/booking.js";
import TourSchedule from "../models/TourSchedule.js";

const runBookingCron = async () => {
  let now = new Date();

  // ── Rule 1b: Hết hạn chưa thanh toán → "Đã hủy" ─────────────────────
  const expiredBookings = await Booking.find({
    trangThaiThanhToan: "Chưa thanh toán",
    expireAt: { $lte: now },
  });

  const expiredIds = [];

  for (const booking of expiredBookings) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const updated = await Booking.updateOne(
        { _id: booking._id, trangThaiThanhToan: "Chưa thanh toán" },
        { $set: { trangThaiThanhToan: "Hết hạn", trangthai: "Đã hủy" } },
        { session }
      );

      if (updated.modifiedCount > 0) {
        expiredIds.push(booking._id);
        if (booking.scheduleId) {
          const totalPeople =
            (booking.soluongnguoilon || 0) + (booking.soluongtreem || 0);
          await TourSchedule.updateOne(
            { _id: booking.scheduleId },
            { $inc: { Conlai: totalPeople } },
            { session }
          );
        }
      }

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      console.error("Lỗi xử lý hết hạn booking:", err.message);
    } finally {
      session.endSession();
    }
  }

  // ── Rule 1: Chưa thanh toán + chưa hết hạn → "Chưa xác nhận" ────────
  await Booking.updateMany(
    {
      trangThaiThanhToan: "Chưa thanh toán",
      trangthai: { $ne: "Chưa xác nhận" },
      ...(expiredIds.length > 0 && { _id: { $nin: expiredIds } }),
    },
    { $set: { trangthai: "Chưa xác nhận" } }
  );

  // ── Rule 2: Đã thanh toán → "Đã xác nhận" ───────────────────────────
  await Booking.updateMany(
    {
      trangThaiThanhToan: "Đã thanh toán",
      trangthai: {
        $nin: ["Đã hủy", "Đang diễn ra", "Hoàn thành tour", "Đã xác nhận"],
      },
    },
    { $set: { trangthai: "Đã xác nhận" } }
  );

  // ── Rule 3 & 4: Lookup từ TourSchedule để lấy đúng ngày ──────────────
  const activeBookings = await Booking.find({
    trangThaiThanhToan: "Đã thanh toán",
    trangthai: { $in: ["Đã xác nhận", "Đang diễn ra"] },
    scheduleId: { $exists: true, $ne: null },
  });

  for (const booking of activeBookings) {
    const schedule = await TourSchedule.findById(booking.scheduleId);
    if (!schedule) continue;

    const { ngaykhoihanh, ngayketthuc } = schedule;

    // Rule 4: Sau ngày kết thúc → "Hoàn thành tour"
    if (ngayketthuc <= now) {
      await Booking.updateOne(
        { _id: booking._id },
        { $set: { trangthai: "Hoàn thành tour" } }
      );
      continue;
    }

    // Rule 3: Đang trong khoảng ngày → "Đang diễn ra"
    if (
      booking.trangthai === "Đã xác nhận" &&
      ngaykhoihanh <= now &&
      ngayketthuc > now
    ) {
      await Booking.updateOne(
        { _id: booking._id },
        { $set: { trangthai: "Đang diễn ra" } }
      );
    }
  }

  console.log(`[Cron] Đã cập nhật trạng thái booking lúc ${now.toISOString()}`);
};

const bookingExpireCron = () => {
  let isRunning = false;

  const wrappedRun = async () => {
    if (isRunning) return;
    isRunning = true;
    try {
      await runBookingCron();
    } catch (err) {
      console.error("Cron lỗi:", err.message);
    } finally {
      isRunning = false;
    }
  };

  // Chạy ngay lập tức khi khởi động
  wrappedRun();

  // Sau đó chạy mỗi 5 phút
  cron.schedule("*/5 * * * *", wrappedRun);
};

export default bookingExpireCron;
