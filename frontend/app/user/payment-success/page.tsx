"use client";
import Navbar from "@/components/Navbar";
import { useBookedTour } from "@/hooks/useBooking"; // chỉnh đường dẫn đúng với project


function formatVND(amount?: number) {
  if (!amount) return "0";
  return amount.toLocaleString("vi-VN");
}

function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return "—";

  // VNPay format: YYYYMMDDHHmmss
  if (/^\d{14}$/.test(dateStr)) {
    const year = dateStr.slice(0, 4);
    const month = dateStr.slice(4, 6);
    const day = dateStr.slice(6, 8);
    const hour = dateStr.slice(8, 10);
    const minute = dateStr.slice(10, 12);

    return `${day}/${month}/${year} ${hour}:${minute}`;
  }

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";

  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export default function BookingHistoryCard() {
  const { bookedTour, loading, error } = useBookedTour();
   console.log("DATA:", bookedTour);
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="w-full flex justify-center mt-10 text-white">
          Đang tải thông tin booking...
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="w-full flex justify-center mt-10 text-red-400">
          {error}
        </div>
      </>
    );
  }

  if (!bookedTour) {
    return (
      <>
        <Navbar />
        <div className="w-full flex justify-center mt-10 text-gray-400">
          Không tìm thấy thông tin booking.
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="w-full flex justify-center">
        <div className="bg-[#0f172a] text-white rounded-3xl p-8 flex justify-between items-center shadow-lg w-full max-w-7xl">
          {/* LEFT */}
          <div className="flex gap-6">
            {/* IMAGE */}
            <div className="w-28 h-28 bg-gray-600 rounded-xl flex items-center justify-center">
              <span className="text-gray-300 text-sm">IMG</span>
            </div>

            {/* INFO */}
            <div>
              <h3 className="font-semibold text-2xl">
                {bookedTour.tour.tenTour} | {bookedTour.tour.diaDiem}
              </h3>

              <div className="text-base text-gray-400 mt-2 space-x-6">
                <span>Mã hoá đơn: {bookedTour.bookingId}</span>
                <span>Mã tour: {bookedTour.tour._id}</span>
              </div>

              <div className="text-base text-gray-400 mt-2 space-x-6">
                <span>Ngày check-in: {formatDate(bookedTour.ngaydi)}</span>
                {/* <span>Ngày check-out: {formatDate(bookedTour.)}</span> */} 
              </div>

              {/* STATUS */}
              <div className="mt-4">
                <span className="bg-green-900 text-green-400 px-4 py-2 rounded-full text-sm">
                  {bookedTour?.trangThaiThanhToan || "Chưa thanh toán"}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="text-right">
            <p className="text-base text-gray-400">{formatDate(bookedTour.ngayThanhToan)}</p>
            <p className="text-base text-gray-400 mt-3">Trạng thái tt</p>
            <p className="text-blue-400 font-medium text-lg">
              {bookedTour.trangThai || "Xác nhận"}
            </p>

            <p className="text-base text-gray-400 mt-3">Tổng cộng</p>
            <p className="font-bold text-2xl">
              {formatVND(bookedTour.tongTien)} đ
            </p>

            {/* BUTTON */}
            <div className="flex gap-3 mt-5 justify-end">
              <button className="border border-gray-500 px-5 py-2 rounded-xl text-sm hover:bg-gray-700">
                Chi tiết
              </button>
              <button className="border border-gray-500 px-5 py-2 rounded-xl text-sm hover:bg-gray-700">
                Viết đánh giá
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}