"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Progress from "@/components/progress";
import { useSearchParams } from "next/navigation";
import type { BookedTour } from "@/types/booking";
import { createVnpayPayment } from "@/services/bookingService";
import Link from "next/link";

const steps = ["Chọn đơn hàng", "Điền thông tin", "Thanh toán"];
const BASE_URL = "http://localhost:3001/api";

function formatVND(amount?: number): string {
  if (typeof amount !== "number") return "0";
  return amount.toLocaleString("vi-VN");
}

function formatDate(iso: string | undefined | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

async function getBookedTourById(bookingId: string): Promise<BookedTour> {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${BASE_URL}/tours/bookingDetail/${bookingId}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const text = await res.text();
  let result;
  try {
    result = JSON.parse(text);
  } catch {
    throw new Error("Server trả về dữ liệu không hợp lệ");
  }
  if (!res.ok || !result.success) {
    throw new Error(result?.message || "Không lấy được thông tin booking");
  }
  return result.data as BookedTour;
}

export default function BookingCheckoutPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const [booking, setBooking] = useState<BookedTour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [currentStep] = useState(2);

  // ✅ Countdown state
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const user = JSON.parse(
    typeof window !== "undefined" ? localStorage.getItem("user") || "{}" : "{}"
  );
  const fullName = user.hoten || "";
  const parts = fullName.trim().split(" ");
  const ten = parts.pop() || "";
  const ho = parts.join(" ");

  // Fetch booking
  useEffect(() => {
    if (!bookingId) {
      setError("Không tìm thấy ID đơn hàng");
      setLoading(false);
      return;
    }
    getBookedTourById(bookingId)
      .then((data) => setBooking(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [bookingId]);

  // ✅ Countdown timer — chạy khi có booking và còn expireAt
  useEffect(() => {
    if (!booking?.expireAt) return;

    const calcLeft = () =>
      Math.max(
        0,
        Math.floor((new Date(booking.expireAt!).getTime() - Date.now()) / 1000)
      );

    setTimeLeft(calcLeft());

    const timer = setInterval(() => {
      const left = calcLeft();
      setTimeLeft(left);
      if (left <= 0) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [booking]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handlePayment = async () => {
    if (!booking?.bookingId) return;
    try {
      const data = await createVnpayPayment(booking.bookingId);
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert("Không tạo được link thanh toán");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi thanh toán");
    }
  };

  // Loading
  if (loading) {
    return (
      <>
        <Navbar />
        <Progress currentStep={currentStep} steps={steps} />
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex gap-6">
            <div className="flex-1 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 rounded-2xl h-32 animate-pulse" />
              ))}
            </div>
            <div className="w-80 space-y-4">
              <div className="bg-gray-200 rounded-xl h-48 animate-pulse" />
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error
  if (error || !booking) {
    return (
      <>
        <Navbar />
        <Progress currentStep={currentStep} steps={steps} />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-10 max-w-md mx-auto">
            <p className="font-semibold text-lg mb-2">Đã xảy ra lỗi</p>
            <p>{error || "Không tìm thấy đơn hàng"}</p>
          </div>
        </div>
      </>
    );
  }

  const { tour, soLuong, giaCurrent, tongTien, dichVu, ngaydi } = booking;

  return (
    <>
      <Navbar />
      <Progress currentStep={currentStep} steps={steps} />

      {/* ✅ Banner countdown — chỉ hiện khi còn hạn */}
      {timeLeft > 0 && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="bg-orange-50 border border-orange-300 text-orange-700 rounded-xl px-5 py-3 text-sm font-medium flex justify-between items-center">
            <span>⏳ Vui lòng hoàn tất thanh toán trước khi hết hạn</span>
            <span className="font-bold text-lg text-red-500">
              {minutes}:{String(seconds).padStart(2, "0")}
            </span>
          </div>
        </div>
      )}

      {/* ✅ Banner hết hạn */}
      {timeLeft === 0 && booking?.expireAt && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="bg-red-50 border border-red-300 text-red-600 rounded-xl px-5 py-3 text-sm font-medium text-center">
            ❌ Đơn hàng đã hết hạn. Vui lòng quay lại và đặt tour mới.
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 pb-10 flex gap-6 items-start mt-4">
        {/* CỘT TRÁI */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h2 className="text-blue-500 font-semibold text-lg">Điền thông tin</h2>
              </div>

              <div className="p-6 space-y-8">
                {/* Thông tin đơn hàng */}
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-1 h-6 bg-blue-500 mr-3" />
                    <h3 className="font-semibold text-lg">Thông tin đơn hàng</h3>
                  </div>
                  <div className="border rounded-xl p-4">
                    <div className="grid grid-cols-[90px_1fr] gap-y-2 text-sm">
                      <span className="text-gray-500">Tên tour:</span>
                      <span className="font-semibold text-gray-800">
                        {tour.tenTour}
                      </span>

                      <span className="text-gray-500">Địa điểm:</span>
                      <span className="font-semibold text-gray-800">
                        {tour.diaDiem}
                      </span>
                    </div>
                  </div>
                </div>
                { }
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-1 h-6 bg-blue-500 mr-3" />
                    <h3 className="font-semibold text-lg">Thông tin dịch vụ</h3>
                  </div>
                  <div className="space-y-3">
                    {dichVu.length === 0 ? (
                      <p className="text-sm text-gray-400 border rounded-xl p-4">
                        Không có dịch vụ đi kèm
                      </p>
                    ) : (
                      dichVu.map(({ detailId, tenDichVu, donGia, thanhTien }) => (
                        <div
                          key={detailId}
                          className="border border-gray-500 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition"
                        >
                          <div className="flex items-start justify-between gap-4">
                            {/* Nội dung */}
                            <div className="space-y-2">
                              <h4 className="text-base font-semibold text-gray-800">
                                {tenDichVu || "Dịch vụ đi kèm"}
                              </h4>

                              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                                <span>
                                  Người lớn:
                                  <span className="ml-1 font-medium text-gray-700">
                                    {formatVND(donGia?.nguoiLon || 0)}₫
                                  </span>
                                </span>

                                <span className="text-gray-300">|</span>

                                <span>
                                  Trẻ em:
                                  <span className="ml-1 font-medium text-gray-700">
                                    {formatVND(donGia?.treEm || 0)}₫
                                  </span>
                                </span>
                              </div>
                            </div>

                            {/* Thành tiền */}
                            <div className="text-right">
                              <p className="text-xs text-gray-400 mb-1">
                                Thành tiền
                              </p>

                              <p className="text-lg font-bold text-blue-600 whitespace-nowrap">
                                {formatVND(thanhTien || 0)}₫
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Thông tin liên lạc */}
                <div>
                  <div className="flex items-center mb-2">
                    <div className="w-1 h-6 bg-blue-500 mr-3" />
                    <h3 className="font-semibold text-lg">Thông tin liên lạc</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Chúng tôi sẽ thông báo cho bạn nếu đơn hàng có sự thay đổi
                  </p>
                  <div className="border rounded-xl p-4 relative">
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <span className="text-gray-500">Họ</span>
                      <span>{ho}</span>
                      <span className="text-gray-500">Tên</span>
                      <span>{ten}</span>
                      <span className="text-gray-500">Số điện thoại</span>
                      <span>{user.sdt}</span>
                      <span className="text-gray-500">Email</span>
                      <span>{user.email}</span>
                    </div>
                    <Link href="/user/profile">
                      <button className="absolute bottom-3 right-4 text-sm text-blue-600 hover:underline">
                        Chỉnh sửa
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Ưu đãi & Thanh toán */}
                <div className="bg-white p-6 rounded-xl shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-1 h-6 bg-blue-500 mr-3" />
                    <h3 className="font-bold text-lg">Loại ưu đãi</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Mã ưu đãi nền tảng</span>
                      <span className="text-gray-500">Không khả dụng</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Mã ưu đãi thanh toán</span>
                      <span className="text-gray-500">Không khả dụng</span>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-xl">
                      <div className="flex gap-2">
                        <input
                          className="flex-1 px-3 py-2 rounded-lg border bg-white outline-none focus:border-blue-500"
                          placeholder="Nhập mã ưu đãi"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition">
                          Áp dụng
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-6">
                    Bằng cách tiếp tục, bạn thừa nhận và đồng ý với Điều khoản Sử dụng chung và Chính sách Bảo mật.
                  </p>
                  <div className="mt-4 bg-orange-50 border border-orange-200 text-orange-700 p-3 rounded-lg text-sm">
                    Vui lòng điền thông tin chính xác. Thông tin không thể chỉnh sửa sau khi gửi.
                  </div>

                  <div className="flex justify-end mt-8">
                    {/* ✅ Disable nút khi hết hạn */}
                    <button
                      onClick={handlePayment}
                      disabled={timeLeft === 0 && !!booking?.expireAt}
                      className={`px-8 py-3 rounded-xl font-semibold transition ${
                        timeLeft === 0 && booking?.expireAt
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      Tiếp tục thanh toán
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI */}
        <div className="w-80 sticky top-6 self-start">
  <div className="space-y-4">

    {/* Card thông tin vé */}
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 text-gray-800">

      {/* Header section */}
      <div className="space-y-3 text-sm">

        <div className="flex justify-between">
          <span className="text-gray-500 font-medium">Tên tour</span>
          <span className="font-semibold text-gray-900 text-right">
            {tour.tenTour}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500 font-medium">Địa điểm</span>
          <span className="font-semibold text-gray-900 text-right">
            {tour.diaDiem}
          </span>
        </div>
      </div>

      {/* divider mạnh hơn */}
      <div className="my-4 border-t border-gray-200"></div>

      {/* Dates */}
      <div className="space-y-3 text-sm">

        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Ngày khởi hành</span>
          <span className="font-semibold text-gray-900">
            {formatDate(ngaydi)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Ngày kết thúc</span>
          <span className="font-semibold text-gray-900">
            {booking?.ngayketthuc
              ? new Date(booking.ngayketthuc).toLocaleDateString("vi-VN")
              : "--/--/----"}
          </span>
        </div>

      </div>

      {/* divider */}
      <div className="my-4 border-t border-gray-200"></div>

      {/* Quantity */}
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 font-medium">Số lượng</span>

        <div className="text-right space-y-1">
          {soLuong.nguoiLon > 0 && (
            <div className="font-semibold text-gray-900">
              Người lớn × {soLuong.nguoiLon}{" "}
              <span className="text-gray-500 font-normal">
                ({formatVND(giaCurrent.nguoiLon)}₫)
              </span>
            </div>
          )}

          {soLuong.treEm > 0 && (
            <div className="font-semibold text-gray-900">
              Trẻ em × {soLuong.treEm}{" "}
              <span className="text-gray-500 font-normal">
                ({formatVND(giaCurrent.treEm)}₫)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Services */}
      {dichVu.length > 0 && (
        <>
          <div className="my-4 border-t border-gray-200"></div>

          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
            Dịch vụ
          </p>

          <div className="mt-2 space-y-2">
            {dichVu.map((dv) => (
              <div key={dv.detailId} className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">
                  {dv.tenDichVu}
                </span>
                <span className="font-semibold text-gray-900">
                  {formatVND(dv.thanhTien)}₫
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* total */}
      <div className="my-4 border-t border-gray-300"></div>

      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-900 text-base">
          Tổng cộng
        </span>
        <span className="text-xl font-extrabold text-blue-600">
          ₫ {formatVND(tongTien)}
        </span>
      </div>
    </div>

    {/* Payment card highlight */}
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm p-5">

      <div className="flex justify-between items-center">
        <span className="text-gray-700 font-semibold">
          Số tiền thanh toán
        </span>

        <span className="text-xl font-extrabold text-blue-600">
          ₫ {formatVND(tongTien)}
        </span>
      </div>

    </div>

  </div>
</div>
      </div>
    </>
  );
}