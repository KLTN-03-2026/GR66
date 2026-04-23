"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaMapMarkerAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";
import { useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";

import {
  useBooking,
  useExtraDetail,
  useSelectedExtras,
  useAdultCount,
  useReview,
  useTourDetail
} from "@/hooks/useBooking";
import { useParams } from "next/navigation";

/* ============ MAIN CONTENT ============ */
function BookingContent() {

  const [showFullLoTrinh, setShowFullLoTrinh] = useState(false);
  const [showFullDieuKhoan, setShowFullDieuKhoan] = useState(false);
  const [showFullChitiettour, setShowFullChitiettour] = useState(false);
  const [adultCount, setAdultCount] = useState(0);
  const [childCount, setChildCount] = useState(0);

  // bật tắt thêm chi tiết thông tin
  const { expandedExtras, toggleExtraDetail } = useExtraDetail();

  // Kiểm tra ngày người dùng với ngày hiện tại
  const { checkInDate, checkInError, handleCheckInChange, today } = useBooking();

  // chọn bỏ dịch vụ thêm , chọn nhiều option trong form, xử lý checkbox list
  const { selectedExtras, setSelectedExtras, toggleExtra } = useSelectedExtras();

  // đảm bảo số lượng người lớn tối thiểu là 1
  const { adult, setAdult, child, setChild, baseAdultCount } = useAdultCount();

  // tính tổng tiền các dịch vụ thêm mà người dùng đã chọn
  let extraTotal = 0;


  const { tour, schedules, price, services, reviews , loading, error } = useTourDetail();
  const { totalReviews, averageRating, visibleReviews, handleLoadMore } = useReview(reviews);
  //tính tổng tiền tour cuối cùng cho người dùng
  const totalPrice = (price?.giaNguoiLon ?? 0) * baseAdultCount + (price?.giaTreEm ?? 0) * child +(extraTotal ?? 0);


  
  const validScheduleDates =
    schedules?.map((item) =>
      new Date(item.ngaykhoihanh).toISOString().split("T")[0]
    ) || [];

  const validDatesAsDate =
    schedules?.map((item) => new Date(item.ngaykhoihanh)) || [];
  const firstScheduleDate =
    schedules && schedules.length > 0
      ? new Date(schedules[0].ngaykhoihanh)
        .toISOString()
        .split("T")[0]
      : "";

  if (loading) return <p className="p-8">Đang tải...</p>;
  if (error) return <p className="p-8 text-red-500">Lỗi: {error}</p>;
  if (!tour) return <p className="p-8">Không tìm thấy tour</p>;


  // lần 1 là bung trang lần 2 là đặt divhj vụ
  //   if (!isSelected) {
  //     // Lần 1 → chỉ chọn
  //     setSelectedExtras([...selectedExtras, id]);
  //   } else {
  //     // Lần 2 → thực hiện hành động (đặt tour)
  //     handleBooking(id); // hàm bạn tự viết
  //   }
  // };



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

        {/* IMAGES review---------------------------------------------------------------------------------- */}
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
        {/* IMAGES review end ---------------------------------------------------------------------------------- */}

        {/* ========================================    Main content     ============================= */}
        <div>
          <div className="grid grid-cols-3 gap-6 mt-6">

            {/* ===== LEFT ===== */}
            <div className="col-span-2 space-y-6">
              {/* DESCRIPTION 1 */}
              <div className="bg-white rounded-xl p-5 shadow-sm border-1 border-gray-400">
                <div className="text-sm text-gray-600">
                  <h1 className="font-semibold text-lg text-gray-800 mb-2">
                    Mô tả
                  </h1>
                  <ul className="list-disc pl-5 space-y-1">
                    {tour.mota}
                  </ul>
                </div>
              </div>
              {/* DESCRIPTION 2 */}
              <div className="bg-white rounded-xl p-5 shadow-sm border-1 border-gray-400">
                <div className="text-sm text-gray-600">
                  <h1 className="font-semibold text-lg text-gray-800 mb-2">
                    Điểm nổi bật
                  </h1>
                  <ul className="list-disc pl-5 space-y-1">
                    {tour.diemNoiBat}
                  </ul>
                </div>
              </div>

              {/* ITINERARY */}
              <div className="bg-white rounded-xl p-5 shadow-sm border-1 border-gray-400">
                <h2 className="font-semibold text-lg text-gray-800 mb-3">
                  Lộ trình
                </h2>
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
                  <h2 className="font-semibold text-lg text-gray-800 mb-3">
                    Chi tiết tour bao gồm
                  </h2>

                  <p className="text-sm text-gray-600 leading-relaxed pl-5">
                    {(() => {
                      const maxLength = 500;
                      const text = tour?.chitiettour || "";
                      const isLongText = text.length > maxLength;

                      return showFullChitiettour
                        ? text
                        : text.slice(0, maxLength) + (isLongText ? "..." : "");
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

                {/*============= ĐIỀU KHOẢN ===========================================*/}
                <div className="bg-white rounded-xl p-5 shadow-sm border-1 border-gray-400">
                  <h2 className="font-semibold text-lg text-gray-800 mb-3">
                    Điều khoản sử dụng
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed pl-5">
                    {(() => {
                      const maxLength = 300;
                      const text = tour.dieuKhoan || "";
                      const isLongText = text.length > maxLength;
                      return showFullDieuKhoan
                        ? text
                        : text.slice(0, maxLength) + (isLongText ? "..." : "");
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
                  const isSelected = selectedExtras.includes(service._id);// nếu true thì render phần chi tiết.
                  const isExpanded = expandedExtras.includes(service._id);
                  return (
                    <div
                      key={service._id}
                      className="bg-white rounded-2xl p-5 shadow-sm border flex flex-col"
                    >
                      <div className="font-medium text-gray-700 mb-3">
                        <span className="font-bold">Loại dịch vụ:</span>{" "}
                        {(service.dichvuId as any)?.serviceTypeId?.loaidichvu}
                      </div>

                      <div className="text-sm text-gray-600">
                        <div className=" text-sm text-gray-600">
                          <p className="font-bold text-gray-700 mb-1">
                            Dịch vụ bao gồm
                          </p>
                          <ul className="list-disc pl-5 space-y-1">
                            {service.noiDungDichVuBaoGom}
                          </ul>
                        </div>
                      </div>

                      {isExpanded && (
                        <>
                          <div className="mt-4 text-sm text-gray-600">
                            <p className="font-bold text-gray-700 mb-1">
                              Dịch vụ không bao gồm
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                              {service.noiDungDichVuKhongBaoGom}
                            </ul>
                          </div>

                          <div className="mt-4 text-sm text-gray-600">
                            <p className="font-bold text-gray-700 mb-1">
                              Điều khoản
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                              {service.dieuKhoan}
                            </ul>
                          </div>
                        </>
                      )}
                      <div className="mt-[10px] flex justify-between items-center gap-4">
                        <button
                          onClick={() => toggleExtraDetail(service._id)}
                          className="text-sm italic underline text-gray-700 hover:text-black transition ml-5"
                        >
                          {isExpanded
                            ? "Thu gọn thông tin dịch vụ"
                            : "Xem thông tin chi tiết của dịch vụ"}
                        </button>
                      </div>


                      {/*chọn số lượng người lớn và trẻ em */}
                      {isSelected && (
                        <div className="mt-5 bg-white rounded-xl p-5 shadow-sm">
                          <h2 className="font-semibold text-lg text-gray-800 mb-4">
                            Chọn số lượng
                          </h2>
                          <div className="flex items-center justify-between py-3 border-b">

                            {/* LEFT */}
                            <div className="w-1/3">
                              <p className="text-gray-800">Người lớn</p>
                            </div>

                            {/* CENTER */}
                            <div className="w-1/3 text-center">
                              <p className="text-blue-500 font-semibold">
                                đ {service.giaApDungNguoiLon}
                              </p>
                            </div>

                            {/* RIGHT */}
                            <div className="w-1/3 flex justify-end items-center gap-2">
                              <button
                                onClick={() => setAdultCount(Math.max(0, adultCount - 1))}
                                className="w-8 h-8 rounded-full bg-white-400 text-black flex items-center justify-center border border-gray-400 "
                              >
                                -
                              </button>
                              <span className="w-6 text-center font-semibold text-gray-800">
                                {adultCount}
                              </span>
                              <button
                                onClick={() => setAdultCount(adultCount + 1)}
                                className="w-8 h-8 rounded-full bg-white-400 text-black flex items-center justify-center border border-gray-400 "
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Trẻ em */}
                          <div className="flex items-center justify-between py-3">

                            <div className="w-1/3">
                              <p className="text-gray-800">Trẻ em (100 - 139 cm)</p>
                            </div>

                            <div className="w-1/3 text-center">
                              <p className="text-blue-500 font-semibold">
                                đ {service.giaApDungTreEm}
                              </p>
                            </div>

                            <div className="w-1/3 flex justify-end items-center gap-2">
                              <button
                                onClick={() => setChildCount(Math.max(0, childCount - 1))}
                                className="w-8 h-8 rounded-full bg-white-400 text-black flex items-center justify-center border border-gray-400 "
                              >
                                -
                              </button>
                              <span className="w-6 text-center font-semibold text-gray-800">
                                {childCount}
                              </span>
                              <button
                                onClick={() => setChildCount(childCount + 1)}
                                className="w-8 h-8 rounded-full bg-white-400 text-black flex items-center justify-center border border-gray-400 "
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/*nút chọn và giá */}
                      <div className="flex items-center gap-4 shrink-0 ml-auto">
                        {!isExpanded && (
                          <p className="font-semibold text-xl text-gray-900 whitespace-nowrap">
                            đ {service.giaApDungNguoiLon.toLocaleString()}
                          </p>
                        )}

                        <button
                          onClick={() => {
                            toggleExtra(service._id); // "Chọn" → hiện form
                          }}
                          className="px-9 py-2.5 text-sm font-medium rounded-full transition-all whitespace-nowrap bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          {isSelected ? "Đặt ngay" : "Chọn"}
                        </button>

                        {isSelected && (
                          <button
                            onClick={() => toggleExtra(service._id)} // "Hủy" → ẩn form
                            className="px-4 py-2.5 text-sm font-medium rounded-full border border-gray-300 hover:bg-gray-100 text-gray-600"
                          >
                            ✕ Hủy
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}


              </div>
            </div>
            {/* ===== LEFT end ===================================================================================================================== */}


            {/* ===== RIGHT BOOKING ===== */}
            <div className="bg-white border rounded-2xl p-6 h-fit shadow-sm  border-1 border-gray-400
                sticky top-24 z-40">
              <p className="font-semibold text-2xl text-gray-800 mb-6">
                Tổng tiền: <span className="text-blue-600">{totalPrice.toLocaleString()} đ</span>
              </p>

              <div >
                <span className="text-lg block text-1xl text-gray-900 font-medium mb-3 ">
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

                      handleCheckInChange({
                        target: { value: formatted },
                      } as React.ChangeEvent<HTMLInputElement>);
                    }}
                    locale={vi}
                    dateFormat="dd/MM/yyyy"
                    includeDates={validDatesAsDate}
                    placeholderText="Chọn ngày khởi hành" 
                    className="w-full border border-gray-300 rounded-lg pl-3 pt-3 pb-3 text-sm focus:ring-2 focus:ring-blue-400 outline-none text-gray-600 mr-40"
                  />

                  {/* icon */}
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 ">
                    📅
                  </span>
                </div>
                {checkInError && (
                  <p className="text-red-500 text-sm mt-2">{checkInError}</p>
                )}
              </div>

              {/* Số người lớn */}
              <div className="flex justify-between items-center mb-4 mt-5">
                <span className="text-lg text-gray-800">Số người lớn</span>
                <div className="flex items-center gap-2 text-gray-600 ">
                  <button onClick={() => setAdult(Math.max(1, adult - 1))} className="w-8 h-8 flex items-center justify-center text-xl border 
                border-gray-300 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-all">−</button>
                  <span className="text-xl font-semibold w-8 text-center">{adult}</span>
                  <button onClick={() => setAdult(adult + 1)} className="w-8 h-8 flex items-center justify-center text-xl border
                 border-gray-300 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-all">+</button>
                </div>
              </div>

              {/* Số trẻ em */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col">
                  <span className="text-lg text-gray-800">Số trẻ em</span>
                  <span className="text-sm text-gray-500">(100cm = 139cm)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <button onClick={() => setChild(Math.max(0, child - 1))} className="w-8 h-8 flex items-center justify-center text-xl border border-gray-300 
                rounded-full hover:bg-gray-100 active:bg-gray-200 transition-all">−</button>
                  <span className="text-xl font-semibold w-8 text-center">{child}</span>
                  <button onClick={() => setChild(child + 1)} className="w-8 h-8 flex items-center justify-center text-xl border border-gray-300 rounded-full
                 hover:bg-gray-100 active:bg-gray-200 transition-all">+</button>
                </div>
              </div>

              <button className="w-full bg-blue-500 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold text-lg transition-all active:scale-95">
                ĐẶT NGAY
              </button>
            </div>
            {/* ===== RIGHT BOOKING end ============================================================================================================ */}

          </div>
        </div>



        {/* ==================== REVIEW SECTION ==================== */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Đánh giá
          </h2>
          {/* ===== Tổng quan ===== */}
          <div className="flex flex-col md:flex-row gap-10 mb-10">

            {/* Điểm trung bình */}
            <div>
              <div className="text-6xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </div>

              <div className="flex text-yellow-400 text-2xl mt-1">
                {"★".repeat(Math.floor(averageRating))}
                {averageRating % 1 >= 0.5 && "★"}
                {"☆".repeat(5 - Math.ceil(averageRating))}
              </div>

              <p className="text-blue-600 mt-1 font-medium">
                {reviews.length} đánh giá
              </p>
            </div>

            {/* Thanh phần trăm theo số sao */}
            <div className="flex-1 space-y-3 mt-3">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter((r) => r.Sosao === star).length; // tọa biến đếm cho số lượng sao (r) lấy ra tại thời
                //điểm hiện tại , filter lọc ra , lấy từng review (r), nếu số sao của nó = star thì giữ lại lấy tổng số lượng đó ra
                let percent = 0;
                if (reviews.length > 0) {
                  // tổng số sao chia cho tổng số review để ra phần trăm
                  percent = Math.round((count / reviews.length) * 100);
                } else {
                  percent = 0;
                }

                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="w-3 text-sm text-gray-600 font-medium">
                      {star}
                    </span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right">
                      {percent}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ===== List review ===== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 " id="reviews-container ">
            {reviews.slice(0, visibleReviews).map((review) => (
              <div
                key={review._id}
                className="bg-white border rounded-2xl p-6 shadow-sm border-1 border-gray-400"
              >
                <div className="flex items-center gap-3 ">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                    👤
                  </div>

                  {/* Info */}
                  <div>
                    <p className="font-medium text-gray-800">{(review.Users_ID as any)?.hoten}</p>
                    <div className="flex text-yellow-400 text-lg">
                      {"★".repeat(review.Sosao)}
                      {"☆".repeat(5 - review.Sosao)}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <p className="mt-4 text-gray-600 text-[15px] leading-relaxed">
                  {review.Noidung};
                </p>
              </div>
            ))}
          </div>

          {/* Nút Xem thêm */}
          {visibleReviews < reviews.length && (
            <div className="flex justify-center mt-10">
              <button
                onClick={handleLoadMore}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white 
                 rounded-full text-sm font-medium transition-all active:scale-95"
              >
                Xem thêm
              </button>
            </div>
          )}
        </div>
        {/* ==================== REVIEW SECTION end ========================================================================================= */}


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