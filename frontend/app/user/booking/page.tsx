/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaMapMarkerAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";
import { useBookingSubmit } from "@/hooks/useBooking";

import {
  useBooking,
  useExtraDetail,
  useSelectedExtras,
  useAdultCount,
  useReview,
  useTourDetail,
  handleBooking,
} from "@/hooks/useBooking";
import { useMemo } from "react";

/* ============ MAIN CONTENT ============ */
function BookingContent() {
  const { handleBookingClick } = useBookingSubmit();
  const [showFullLoTrinh, setShowFullLoTrinh] = useState(false);
  const [showFullDieuKhoan, setShowFullDieuKhoan] = useState(false);
  const [showFullChitiettour, setShowFullChitiettour] = useState(false);
  const [confirmedExtras, setConfirmedExtras] = useState<string[]>([]);
  // bật tắt thêm chi tiết thông tin
  const { expandedExtras, toggleExtraDetail } = useExtraDetail();
  // Kiểm tra ngày người dùng với ngày hiện tại
  const { checkInDate, checkInError, handleCheckInChange } = useBooking();
  // chọn bỏ dịch vụ thêm, chọn nhiều option trong form, xử lý checkbox list
  const { selectedExtras, toggleExtra } = useSelectedExtras();
  // đảm bảo số lượng người tour cho người lớn tối thiểu là 1
  const { adult, setAdult, child, setChild } = useAdultCount();
  // khai báo biến và hàm để lấy dữ liệu tour, lịch khởi hành, giá, dịch vụ thêm, đánh giá
  //destructure thêm tourId từ useTourDetail
  const { tour, schedules, price, services, reviews, loading: loadingTour, error: errorTour, tourId } = useTourDetail();
  // khai báo biến và hàm để xử lý phần đánh giá
  const { totalReviews, averageRating, visibleReviews, handleLoadMore } = useReview(reviews);

  //lấy userId từ localStorage (hoặc thay bằng auth context nếu có)
  const userId =
    typeof window !== "undefined"
      ? (localStorage.getItem("userId") ?? "")
      : "";

  // useMemo sẽ: KHÔNG chạy lại mỗi render, CHỈ chạy khi dependency thay đổi
  const { total } = useMemo(() => {
    return handleBooking({
      services,
      selectedExtras: confirmedExtras, // mảng chứa id dịch vụ người dùng đã xác nhận đặt
      adultCount: adult,
      childCount: child,
      price,
    });
  }, [services, confirmedExtras, adult, child, price]);

  // hiển thị số chỗ theo ngày khởi hành người dùng chọn
  const selectedSchedule = schedules?.find((item) => {
    const itemDate = new Date(item.ngaykhoihanh).toISOString().split("T")[0];
    return itemDate === checkInDate;
  });

  // chuyển đổi mảng ngày khởi hành sang dạng Date để truyền vào DatePicker
  const validDatesAsDate =
    schedules?.map((item) => new Date(item.ngaykhoihanh)) || [];

  // Hàm lấy ngày hiện tại, dùng để so sánh với ngày khởi hành người dùng chọn
  const getToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  if (loadingTour) return <p className="p-8">Đang tải...</p>;
  if (errorTour) return <p className="p-8 text-red-500">Lỗi: {errorTour}</p>;
  if (!tour) return <p className="p-8">Không tìm thấy tour</p>;

  //tạo hàm riêng để gọi khi bấm nút ĐẶT NGAY, KHÔNG gọi trực tiếp trong body component
  const onBookingClick = () => {
    handleBookingClick({
      tourId: tourId ?? "",
      adult,
      child,
      checkInDate,
      tourServiceIds: confirmedExtras,
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-30">
      <div className="max-w-6xl mx-auto p-6 ">

        {/* TITLE */}
        <h1 className="text-2xl font-semibold text-gray-800 ">
          {tour.tenTour}
        </h1>
        <div className="flex">
          <p className="text-sm text-gray-500 mt-1 mb-3  ">
            ⭐ {averageRating.toFixed(1)} | {totalReviews} đánh giá
          </p>

          <h2 className="text-sm text-gray-500 mt-1 mb-3 ml-8 flex items-center gap-1">
            <FaMapMarkerAlt className="text-red-500" />
            {tour.diaDiem}
          </h2>
        </div>

        {/* IMAGES */}
        <div className="grid grid-cols-3 gap-4">
          {tour?.hinhAnh?.[0] && (
            <div className="col-span-2 h-[400px] relative">
              <img
                src={`http://localhost:3001/uploads/${tour.hinhAnh[0]}`}
                className="rounded-xl object-cover w-full h-full"
              />
            </div>
          )}

          {/* Ảnh nhỏ */}
          <div className="grid grid-cols-2 gap-4 mt-3.5">
            {tour?.hinhAnh?.slice(1)?.map((img, index) => (
              <div key={index} className="relative h-[160px]">
                <img
                  src={`http://localhost:3001/uploads/${img}`}
                  className="rounded-xl object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ========== Main content ========== */}
        <div>
          <div className="grid grid-cols-3 gap-6 mt-6">

            {/* ===== LEFT ===== */}
            <div className="col-span-2 space-y-6">

              {/* DESCRIPTION 1 */}
              <div className="bg-white rounded-xl p-5 shadow-sm border-1 border-gray-400">
                <div className="text-sm text-gray-600">
                  <h1 className="font-semibold text-lg text-gray-800 mb-2">Mô tả</h1>
                  <ul className="list-disc pl-5 space-y-1">{tour.mota}</ul>
                </div>
              </div>

              {/* DESCRIPTION 2 */}
              <div className="bg-white rounded-xl p-5 shadow-sm border-1 border-gray-400">
                <div className="text-sm text-gray-600">
                  <h1 className="font-semibold text-lg text-gray-800 mb-2">Điểm nổi bật</h1>
                  <ul className="list-disc pl-5 space-y-1">{tour.diemNoiBat}</ul>
                </div>
              </div>

              {/* ITINERARY */}
              <div className="bg-white rounded-xl p-5 shadow-sm border-1 border-gray-400">
                <h2 className="font-semibold text-lg text-gray-800 mb-3">Lộ trình</h2>
                <p className="text-sm text-gray-600 leading-relaxed pl-5">
                  {(() => {
                    const maxLength = 300;
                    const text = tour.loTrinh || "";
                    const isLongText = text.length > maxLength;
                    return showFullLoTrinh ? text : text.slice(0, maxLength) + (isLongText ? "..." : "");
                  })()}
                </p>
                {tour.loTrinh?.length > 300 && (
                  <div className="flex justify-end mt-4">
                    <span
                      onClick={() => setShowFullLoTrinh(!showFullLoTrinh)}
                      className="text-blue-600 underline cursor-pointer text-sm font-medium"
                    >
                      {showFullLoTrinh ? "Thu gọn ↑" : "Xem thêm →"}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-6">

                {/* INCLUDED SERVICES */}
                <div className="bg-white rounded-xl p-5 shadow-sm border-1 border-gray-400">
                  <h2 className="font-semibold text-lg text-gray-800 mb-3">Chi tiết tour bao gồm</h2>
                  <p className="text-sm text-gray-600 leading-relaxed pl-5">
                    {(() => {
                      const maxLength = 500;
                      const text = tour?.chitiettour || "";
                      const isLongText = text.length > maxLength;
                      return showFullChitiettour ? text : text.slice(0, maxLength) + (isLongText ? "..." : "");
                    })()}
                  </p>
                  {tour?.chitiettour?.length > 300 && (
                    <div className="flex justify-end mt-4">
                      <span
                        onClick={() => setShowFullChitiettour(!showFullChitiettour)}
                        className="text-blue-600 underline cursor-pointer text-sm font-medium"
                      >
                        {showFullChitiettour ? "Thu gọn ↑" : "Xem thêm →"}
                      </span>
                    </div>
                  )}
                </div>

                {/* ĐIỀU KHOẢN */}
                <div className="bg-white rounded-xl p-5 shadow-sm border-1 border-gray-400">
                  <h2 className="font-semibold text-lg text-gray-800 mb-3">Điều khoản sử dụng</h2>
                  <p className="text-sm text-gray-600 leading-relaxed pl-5">
                    {(() => {
                      const maxLength = 300;
                      const text = tour.dieuKhoan || "";
                      const isLongText = text.length > maxLength;
                      return showFullDieuKhoan ? text : text.slice(0, maxLength) + (isLongText ? "..." : "");
                    })()}
                  </p>
                  {tour.dieuKhoan?.length > 300 && (
                    <div className="flex justify-end mt-4">
                      <span
                        onClick={() => setShowFullDieuKhoan(!showFullDieuKhoan)}
                        className="text-blue-600 underline cursor-pointer text-sm font-medium"
                      >
                        {showFullDieuKhoan ? "Thu gọn ↑" : "Xem thêm →"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Dịch vụ thêm */}
                {services.map((service) => {
                  const isSelected = selectedExtras.includes(service._id);
                  const isExpanded = expandedExtras.includes(service._id);
                  return (
                    <div
                      key={service._id}
                      className="bg-white rounded-2xl p-5 flex flex-col border border-white shadow-none"
                    >
                      <div className="font-medium text-gray-700 mb-3">
                        <span className="font-bold">Loại dịch vụ:</span>{" "}
                        {(service.dichvuId as any)?.serviceTypeId?.loaidichvu}
                      </div>

                      <div className="text-sm text-gray-600">
                        <p className="font-bold text-gray-700 mb-1">Dịch vụ bao gồm</p>
                        <ul className="list-disc pl-5 space-y-1">{service.noiDungDichVuBaoGom}</ul>
                      </div>

                      {isExpanded && (
                        <>
                          <div className="mt-4 text-sm text-gray-600">
                            <p className="font-bold text-gray-700 mb-1">Dịch vụ không bao gồm</p>
                            <ul className="list-disc pl-5 space-y-1">{service.noiDungDichVuKhongBaoGom}</ul>
                          </div>
                          <div className="mt-4 text-sm text-gray-600">
                            <p className="font-bold text-gray-700 mb-1">Điều khoản</p>
                            <ul className="list-disc pl-5 space-y-1">{service.dieuKhoan}</ul>
                          </div>
                        </>
                      )}

                      <div className="mt-[10px] flex justify-between items-center gap-4">
                        <button
                          onClick={() => toggleExtraDetail(service._id)}
                          className="text-sm italic underline text-gray-700 hover:text-black transition ml-5"
                        >
                          {isExpanded ? "Thu gọn thông tin dịch vụ" : "Xem thông tin chi tiết của dịch vụ"}
                        </button>
                      </div>

                      {isSelected && (
                        <div className="mt-5 bg-white rounded-2xl p-5 shadow-sm font-sans">
                          <h2 className="text-lg font-semibold text-gray-800 mb-4">Bảng giá dịch vụ</h2>
                          <div className="flex items-center justify-between py-3">
                            <p className="text-gray-800 font-medium">Người lớn</p>
                            <span className="text-blue-600 font-semibold text-base whitespace-nowrap">
                              đ {service?.giaApDungNguoiLon?.toLocaleString("vi-VN")}
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-3">
                            <div>
                              <p className="text-gray-800 font-medium">Trẻ em</p>
                              <p className="text-sm text-gray-500">(100 - 139 cm)</p>
                            </div>
                            <span className="text-blue-600 font-semibold text-base whitespace-nowrap">
                              đ {service?.giaApDungTreEm?.toLocaleString("vi-VN")}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-4 shrink-0 ml-auto">
                        {!isExpanded && (
                          <p className="font-semibold text-xl text-gray-900 whitespace-nowrap">
                            đ {service.giaApDungNguoiLon.toLocaleString()}
                          </p>
                        )}

                        {!isSelected ? (
                          <button
                            onClick={() => toggleExtra(service._id)}
                            className="px-9 py-2.5 bg-blue-500 text-white rounded-full"
                          >
                            Chọn
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setConfirmedExtras((prev) => {
                                  if (prev.includes(service._id)) return prev;
                                  return [...prev, service._id];
                                });
                              }}
                              className={`px-4 py-2.5 rounded-full text-white ${
                                confirmedExtras.includes(service._id)
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-blue-500"
                              }`}
                              // disable nút khi đã xác nhận để tránh bấm lại
                              disabled={confirmedExtras.includes(service._id)}
                            >
                              {confirmedExtras.includes(service._id) ? "Đã chọn" : "Xác nhận dịch vụ"}
                            </button>

                            {confirmedExtras.includes(service._id) && (
                              <button
                                onClick={() => {
                                  setConfirmedExtras((prev) =>
                                    prev.filter((id) => id !== service._id)
                                  );
                                }}
                                className="px-4 py-2.5 border border-red-500 text-red-600 font-semibold rounded-full hover:bg-red-50"
                              >
                                ✕ Hủy
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}

              </div>
            </div>
            {/* ===== LEFT end ===== */}

            {/* ===== RIGHT BOOKING ===== */}
            <div
              className="bg-white border rounded-2xl p-6 h-fit shadow-sm border-1 border-gray-400
              sticky top-24 z-40"
            >
              {price ? (
                <p className="font-semibold text-2xl text-gray-800 mb-6">
                  Tổng tiền: <span className="text-blue-600">{total.toLocaleString()} đ</span>
                </p>
              ) : (
                <p>Đang tải giá...</p>
              )}

              <div>
                <span className="text-lg block text-1xl text-gray-900 font-medium mb-3">
                  Số chỗ còn lại: {selectedSchedule?.Conlai ?? "0"}
                </span>
                <span className="text-lg block text-1xl text-gray-900 font-medium mb-3">
                  Ngày khởi hành
                </span>
                <div className="relative">
                  <DatePicker
                    selected={checkInDate ? new Date(checkInDate) : null}
                    onChange={(date: Date | null) => {
                      if (!date) return;
                      const yyyy = date.getFullYear();
                      const mm = String(date.getMonth() + 1).padStart(2, "0");
                      const dd = String(date.getDate()).padStart(2, "0");
                      const formatted = `${yyyy}-${mm}-${dd}`;
                      handleCheckInChange(formatted);
                    }}
                    locale={vi}
                    dateFormat="dd/MM/yyyy"
                    includeDates={validDatesAsDate}
                    placeholderText="Chọn ngày khởi hành"
                    minDate={getToday()}
                    filterDate={(date) => date >= getToday()}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    yearDropdownItemNumber={100}
                    scrollableYearDropdown
                    className="w-full border border-gray-300 rounded-lg pl-3 pt-3 pb-3 text-sm focus:ring-2 focus:ring-blue-400 outline-none text-gray-600 mr-40"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">📅</span>
                </div>
                {checkInError && <p className="text-red-500 text-sm mt-2">{checkInError}</p>}
              </div>

              {/* Số người lớn */}
              <div className="flex justify-between items-center mb-4 mt-5">
                <span className="text-lg text-gray-800">Số người lớn</span>
                <div className="flex items-center gap-2 text-gray-600">
                  <button
                    onClick={() => setAdult(Math.max(1, adult - 1))}
                    className="w-8 h-8 flex items-center justify-center text-xl border border-gray-300 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-all"
                  >
                    −
                  </button>
                  <span className="text-xl font-semibold w-8 text-center">{adult}</span>
                  <button
                    onClick={() => setAdult(adult + 1)}
                    className="w-8 h-8 flex items-center justify-center text-xl border border-gray-300 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-all"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Số trẻ em */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col">
                  <span className="text-lg text-gray-800">Số trẻ em</span>
                  <span className="text-sm text-gray-500">(100cm - 139cm)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <button
                    onClick={() => setChild(Math.max(0, child - 1))}
                    className="w-8 h-8 flex items-center justify-center text-xl border border-gray-300 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-all"
                  >
                    −
                  </button>
                  <span className="text-xl font-semibold w-8 text-center">{child}</span>
                  <button
                    onClick={() => setChild(child + 1)}
                    className="w-8 h-8 flex items-center justify-center text-xl border border-gray-300 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-all"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                className="w-full bg-blue-500 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold text-lg transition-all active:scale-95"
                onClick={onBookingClick}
              >
                ĐẶT NGAY
              </button>
            </div>

          </div>
        </div>

        {/* ==================== REVIEW SECTION ==================== */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Đánh giá</h2>

          <div className="flex flex-col md:flex-row gap-10 mb-10">
            <div>
              <div className="text-6xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex text-yellow-400 text-2xl mt-1">
                {"★".repeat(Math.floor(averageRating))}
                {averageRating % 1 >= 0.5 && "★"}
                {"☆".repeat(5 - Math.ceil(averageRating))}
              </div>
              <p className="text-blue-600 mt-1 font-medium">{reviews.length} đánh giá</p>
            </div>

            <div className="flex-1 space-y-3 mt-3">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter((r) => r.Sosao === star).length;
                const percent = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="w-3 text-sm text-gray-600 font-medium">{star}</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right">{percent}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="reviews-container">
            {reviews.slice(0, visibleReviews).map((review) => (
              <div
                key={review._id}
                className="bg-white border rounded-2xl p-6 shadow-sm border-1 border-gray-400"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                    👤
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{(review.Users_ID as any)?.hoten}</p>
                    <div className="flex text-yellow-400 text-lg">
                      {"★".repeat(review.Sosao)}
                      {"☆".repeat(5 - review.Sosao)}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-gray-600 text-[15px] leading-relaxed">
                  {review.Noidung}
                </p>
              </div>
            ))}
          </div>

          {visibleReviews < reviews.length && (
            <div className="flex justify-center mt-10">
              <button
                onClick={handleLoadMore}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-all active:scale-95"
              >
                Xem thêm
              </button>
            </div>
          )}
        </div>
        {/* ==================== REVIEW SECTION end ==================== */}
      </div>
    </div>
  );
}

/* ============ PAGE EXPORT ============ */
export default function TourDetailBody() {
  return (
    <>
      <Navbar />
      <BookingContent />
      <Footer />
    </>
  );
}
