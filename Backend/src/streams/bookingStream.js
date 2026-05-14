import mongoose from "mongoose";
import Booking from "../models/booking.js";
import TourSchedule from "../models/TourSchedule.js";

// ── Timer tự động → "Hoàn thành tour" đúng lúc ngayketthuc ───────────────
const scheduleCompletionTimer = (bookingId, ngayketthuc) => {
  const delay = new Date(ngayketthuc) - new Date();
  if (delay <= 0) return;

  setTimeout(async () => {
    try {
      await Booking.updateOne(
        {
          _id: bookingId,
          trangthai: { $in: ["Đã xác nhận", "Đang diễn ra"] },
        },
        { $set: { trangthai: "Hoàn thành tour" } }
      );
      console.log(`[Timer] Booking ${bookingId} → Hoàn thành tour`);
    } catch (err) {
      console.error(`[Timer] Lỗi hoàn thành booking ${bookingId}:`, err.message);
    }
  }, delay);

  console.log(
    `[Timer] Đặt lịch hoàn thành booking ${bookingId} lúc ${new Date(ngayketthuc).toISOString()}`
  );
};

const bookingStream = () => {
  const stream = Booking.watch();

  stream.on("change", async (change) => {
    if (change.operationType !== "update") return;

    const bookingId = change.documentKey._id;
    const booking = await Booking.findById(bookingId);
    if (!booking) return;

    const now = new Date();

    // ── Lấy ngày từ TourSchedule ──────────────────────────────────────────
    let ngaykhoihanh = null;
    let ngayketthuc = null;

    if (booking.scheduleId) {
      const schedule = await TourSchedule.findById(booking.scheduleId);
      if (schedule) {
        ngaykhoihanh = schedule.ngaykhoihanh;
        ngayketthuc = schedule.ngayketthuc;
      }
    }

    // ── Rule 1b: Hết hạn chưa thanh toán → "Đã hủy" ─────────────────────
    if (
      booking.trangThaiThanhToan === "Chưa thanh toán" &&
      booking.expireAt <= now
    ) {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        await Booking.updateOne(
          { _id: bookingId },
          { $set: { trangThaiThanhToan: "Hết hạn", trangthai: "Đã hủy" } },
          { session }
        );

        if (booking.scheduleId) {
          const totalPeople =
            (booking.soluongnguoilon || 0) + (booking.soluongtreem || 0);
          await TourSchedule.updateOne(
            { _id: booking.scheduleId },
            { $inc: { Conlai: totalPeople } },
            { session }
          );
        }
        await session.commitTransaction();
      } catch (err) {
        await session.abortTransaction();
        console.error("Lỗi stream hủy booking:", err.message);
      } finally {
        session.endSession();
      }
      return;
    }

    // ── Chỉ xử lý tiếp nếu đã thanh toán ────────────────────────────────
    if (booking.trangThaiThanhToan !== "Đã thanh toán") return;

    // ── Rule 2: Vừa thanh toán → "Đã xác nhận" ───────────────────────────
    if (
      !["Đã hủy", "Đang diễn ra", "Hoàn thành tour", "Đã xác nhận"].includes(
        booking.trangthai
      )
    ) {
      await Booking.updateOne(
        { _id: bookingId },
        { $set: { trangthai: "Đã xác nhận" } }
      );
      booking.trangthai = "Đã xác nhận";
    }

    // ── Rule 4: Sau ngày kết thúc → "Hoàn thành tour" ────────────────────
    if (
      ["Đã xác nhận", "Đang diễn ra"].includes(booking.trangthai) &&
      ngayketthuc &&
      ngayketthuc <= now
    ) {
      await Booking.updateOne(
        { _id: bookingId },
        { $set: { trangthai: "Hoàn thành tour" } }
      );
      return;
    }

    // ── Rule 3: Đang trong khoảng ngày → "Đang diễn ra" ──────────────────
    if (
      booking.trangthai === "Đã xác nhận" &&
      ngaykhoihanh &&
      ngayketthuc &&
      ngaykhoihanh <= now &&
      ngayketthuc > now
    ) {
      await Booking.updateOne(
        { _id: bookingId },
        { $set: { trangthai: "Đang diễn ra" } }
      );
      // Đặt timer hoàn thành đúng lúc ngayketthuc
      scheduleCompletionTimer(bookingId, ngayketthuc);
      return;
    }

    // ── "Đã xác nhận" nhưng chưa đến ngày → đặt timer cho cả 2 mốc ─────
    if (
      booking.trangthai === "Đã xác nhận" &&
      ngaykhoihanh &&
      ngayketthuc &&
      ngaykhoihanh > now
    ) {
      // Timer 1: đến ngayketthuc → set "Đang diễn ra" rồi đặt timer kết thúc
      const delayStart = new Date(ngaykhoihanh) - now;
      setTimeout(async () => {
        try {
          await Booking.updateOne(
            { _id: bookingId, trangthai: "Đã xác nhận" },
            { $set: { trangthai: "Đang diễn ra" } }
          );
          console.log(`[Timer] Booking ${bookingId} → Đang diễn ra`);
          scheduleCompletionTimer(bookingId, ngayketthuc);
        } catch (err) {
          console.error(`[Timer] Lỗi bắt đầu booking ${bookingId}:`, err.message);
        }
      }, delayStart);

      console.log(
        `[Timer] Đặt lịch bắt đầu booking ${bookingId} lúc ${new Date(ngaykhoihanh).toISOString()}`
      );
    }
  });

  stream.on("error", (err) => {
    console.error("Booking stream error:", err.message);
  });
};

export default bookingStream;