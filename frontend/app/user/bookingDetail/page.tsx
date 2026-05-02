"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Progress from "@/components/progress";
import { useSearchParams } from "next/navigation";
import type { BookedTour, DichVu } from "@/types/booking";
import { createVnpayPayment } from "@/services/bookingService";


const steps = ["Chọn đơn hàng", "Điền thông tin", "Thanh toán"];
// ─── Helpers ──────────────────────────────────────────────────────────────────
const BASE_URL = "http://localhost:3001/api";
/** Format tiền VND */
function formatVND(amount?: number): string {
  if (typeof amount !== "number") return "0";
  return amount.toLocaleString("vi-VN");
}
/** Format ngày ISO → dd/MM/yyyy */
function formatDate(iso: string | undefined | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}
// ─── API Function ─────────────────────────────────────────────────────────────
async function getBookedTourById(bookingId: string): Promise<BookedTour> {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${BASE_URL}/tours/bookingDetail/${bookingId}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const text = await res.text();
  // console.log("Raw response:", text);
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BookingCheckoutPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  console.log("bookingId:", bookingId);
  const [booking, setBooking] = useState<BookedTour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [currentStep] = useState(2); // Bước "Điền thông tin"

  // Fetch booking theo bookingId
  useEffect(() => {
    if (!bookingId) {
      setError("Không tìm thấy ID đơn hàng");
      setLoading(false);
      return;
    }
    getBookedTourById(bookingId)
      .then((data) => {
        setBooking(data);
      })
      .catch((err: Error) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [bookingId]);
    
  //in ra dữ liệu booking
  useEffect(() => {
    console.log("booking:", booking);
  }, [booking]);

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
  }

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

  const { tour, soLuong, giaCurrent, tongTien, dichVu, ngaydat , ngaydi } = booking;
  return (
    <>
      <Navbar />
      <Progress currentStep={currentStep} steps={steps} />

      <div className="max-w-7xl mx-auto px-4 pb-10 flex gap-6 items-start">
        {/* CỘT TRÁI - Nội dung chính */}
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
                  <div className="border rounded-xl p-4 flex items-center gap-4">
                    <div>
                      <h4 className="font-semibold">{tour.tenTour}</h4>
                      <p className="text-sm text-gray-500">{tour.diaDiem}</p>
                    </div>
                  </div>
                </div>

                {/* Thông tin dịch vụ */}
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
                        <div key={detailId} className="border rounded-xl p-4">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-semibold">
                                {tenDichVu || "Dịch vụ đi kèm"}
                              </h4>

                              <p className="text-sm text-gray-500 mt-1">
                                Người lớn: {formatVND(donGia?.nguoiLon || 0)}₫ | Trẻ em:{" "}
                                {formatVND(donGia?.treEm || 0)}₫
                              </p>
                            </div>

                            <span className="text-blue-500 font-semibold text-sm">
                              {formatVND(thanhTien || 0)}₫
                            </span>
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
                      <span>Bao</span>
                      <span className="text-gray-500">Tên</span>
                      <span>Pham</span>
                      <span className="text-gray-500">Số điện thoại</span>
                      <span>84-012228077370</span>
                      <span className="text-gray-500">Email</span>
                      <span>baopham9424@gmail.com</span>
                    </div>
                    <button className="absolute bottom-3 right-4 text-sm text-blue-600 hover:underline">
                      Chỉnh sửa
                    </button>
                  </div>
                </div>

                {/* Loại ưu đãi & Thanh toán */}
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
                    <button
                      onClick={handlePayment}
                      className="bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-600 transition"
                    >
                      Tiếp tục thanh toán
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI - Tóm tắt đơn hàng (Sticky) */}
        <div className="w-80 sticky top-6 self-start">
          <div className="space-y-4">
            {/* Card thông tin vé */}
            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="text-lg font-semibold">{tour.tenTour}</h2>
              <p className="text-sm text-gray-500 mt-1">{tour.diaDiem}</p>

              <hr className="my-4" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Ngày khởi hành</span>
                  <span className="font-medium">{formatDate(ngaydi)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Số lượng</span>
                  <div className="text-right">
                    {soLuong.nguoiLon > 0 && (
                      <div>
                        Người lớn × {soLuong.nguoiLon}{" "}
                        <span className="text-gray-400">({formatVND(giaCurrent.nguoiLon)}₫)</span>
                      </div>
                    )}
                    {soLuong.treEm > 0 && (
                      <div>
                        Trẻ em × {soLuong.treEm}{" "}
                        <span className="text-gray-400">({formatVND(giaCurrent.treEm)}₫)</span>
                      </div>
                    )}
                  </div>
                </div>

                {dichVu.length > 0 && (
                  <>
                    <hr />
                    <p className="text-xs text-gray-400 uppercase tracking-widest">Dịch vụ</p>
                    {dichVu.map((dv) => (
                      <div key={dv.detailId} className="flex justify-between">
                        <span className="text-gray-500">{dv.tenDichVu}</span>
                        <span>{formatVND(dv.thanhTien)}₫</span>
                      </div>
                    ))}
                  </>
                )}
              </div>

              <hr className="my-4" />

              <div className="flex justify-between items-center text-lg">
                <span className="font-medium text-gray-700">Tổng cộng</span>
                <span className="font-bold">₫ {formatVND(tongTien)}</span>
              </div>
            </div>

            {/* Card thanh toán */}
            <div className="bg-white rounded-xl shadow p-5">
              <div className="flex justify-between">
                <span className="text-gray-600">Số tiền thanh toán</span>
                <span className="text-xl font-bold text-blue-500">₫ {formatVND(tongTien)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}