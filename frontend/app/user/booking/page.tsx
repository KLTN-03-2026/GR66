"use client";

import Image from "next/image";
import { useState } from "react";
import { tourData } from "@/components/tourData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


/* ============ MAIN CONTENT ============ */
function BookingContent() {
  const [adult, setAdult] = useState(0);
  const [child, setChild] = useState(0);
  const review = tourData.reviewSection;
  const totalReviews = review.list.length;

  const averageRating = totalReviews > 0
    ? review.list.reduce((sum, item) => sum + item.rating, 0) / totalReviews
    : 0;
  const [visibleReviews, setVisibleReviews] = useState(4);

  const handleLoadMore = () => {
    setVisibleReviews(prev => Math.min(prev + 4, review.list.length));
  };
  return (
    <div className="bg-gray-50 min-h-screen pb-30">
      <div className="max-w-6xl mx-auto p-6 ">

        {/* TITLE */}
        <h1 className="text-2xl font-semibold text-gray-800">
          {tourData.title}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          ⭐ {tourData.rating} | {tourData.reviews} đánh giá
        </p>

        {/* ========================================    Main content     ============================= */}
        <div className="grid grid-cols-3 gap-6 mt-6">

          {/* ===== LEFT ===== */}
          <div className="col-span-2 space-y-6">

            {/* IMAGES review---------------------------------------------------------------------------------- */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-[300px] relative">
                <Image
                  src={tourData.images[0]}
                  alt=""
                  fill
                  className="rounded-xl object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-3.5">
                {tourData.images.slice(1).map((img, index) => (
                  <div key={index} className="relative h-[120px]">
                    <Image
                      src={img}
                      alt=""
                      fill
                      className="rounded-xl object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* IMAGES review end ---------------------------------------------------------------------------------- */}

            {/* DESCRIPTION */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-lg text-gray-800 mb-2">
                {tourData.description.title}
              </h2>
              <p className="text-gray-500 text-sm">
                {tourData.description.content}
              </p>

              <div className="mt-4 text-sm text-gray-600">
                <p className="font-medium text-gray-800 mb-2">
                  Điểm nổi bật
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  {tourData.description.highlights.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            {/* DESCRIPTION end-----------------------------------------------------------------------------------------*/}

            {/* ITINERARY */}
            {/* ITINERARY */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-lg text-gray-800 mb-2">
                Lộ trình
              </h2>

              <p className="text-gray-700 font-medium mb-3">
                {tourData.itinerary.title}
              </p>

              {/* Phần hiển thị lộ trình với giới hạn */}
              <ul className="text-sm text-gray-600 space-y-1 overflow-hidden" id="itinerary-list">
                {tourData.itinerary.schedule.map((item, index) => (
                  <li
                    key={index}
                    className={index >= 5 ? "hidden" : ""}   // Ẩn từ dòng thứ 6 trở đi
                  >
                    {item}
                  </li>
                ))}
              </ul>

              {/* Nút Xem thêm / Thu gọn */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    const list = document.getElementById('itinerary-list');
                    const button = document.querySelector('#itinerary-button span');

                    if (list) {
                      const hiddenItems = list.querySelectorAll('li.hidden');
                      if (hiddenItems.length > 0) {
                        // Hiển thị tất cả
                        hiddenItems.forEach(item => item.classList.remove('hidden'));
                        if (button) button.textContent = 'Thu gọn ↑';
                      } else {
                        // Ẩn bớt, chỉ giữ 5 dòng
                        const allItems = list.querySelectorAll('li');
                        allItems.forEach((item, idx) => {
                          if (idx >= 5) item.classList.add('hidden');
                        });
                        if (button) button.textContent = 'Xem thêm →';
                      }
                    }
                  }}
                  id="itinerary-button"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white 
                 rounded-3xl text-sm font-medium flex items-center gap-2 
                 transition-all active:scale-95"
                >
                  <span>Xem thêm →</span>
                </button>
              </div>
            </div>
            {/* ITINERARY end -------------------------------------------------------------------- */}


            <div className="space-y-6">

              {/* INCLUDED SERVICES */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Chi tiết dịch vụ bao gồm
                </h3>
                <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                  {tourData.included.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* EXTRA SERVICES */}
              {tourData.extra.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl p-5 shadow-sm border flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {service.title}
                    </h3>

                    <p className="text-sm text-gray-600">
                      {service.description}
                    </p>

                    <p className="font-medium mt-2 text-red-400">
                      Giá: {service.price.toLocaleString()} vnd
                    </p>
                  </div>

                  <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full">
                    Thêm
                  </button>
                </div>
              ))}

            </div>
          </div>
          {/* ===== LEFT end ===================================================================================================================== */}




          {/* ===== RIGHT BOOKING ===== */}
          <div className="bg-white border rounded-xl p-5 h-fit shadow-sm ">
            <p className="font-semibold text-lg text-gray-800 mb-4">
              Total: {tourData.price} đ
            </p>

            <div className="mb-3">
              <label className="text-1.5xl text-gray-800">Check-in</label>
              <input
                type="date"
                className="w-full border rounded-lg p-2 mt-1 text-sm focus:ring-2 focus:ring-blue-400 outline-none text-gray-300"
              />
            </div>

            <div className="flex justify-between items-center mb-3 mt-5">
              <span className="text-1.5xl text-gray-800">Số người lớn</span>

              <div className="flex items-center gap-2 text-gray-300">
                {/* Nút trừ */}
                <button
                  onClick={() => setAdult(Math.max(0, adult - 1))}
                  className="w-8 h-8 flex items-center justify-center text-xl border border-gray-300 rounded-full hover:bg-gray-100
                   active:bg-gray-200 transition-colors duration-200"
                >
                  −
                </button>

                {/* Số lượng */}
                <span className="text-xl font-semibold w-6 text-center tabular-nums">
                  {adult}
                </span>

                {/* Nút cộng */}
                <button
                  onClick={() => setAdult(adult + 1)}
                  className="w-8 h-8 flex items-center justify-center text-xl border border-gray-300 rounded-full hover:bg-gray-100
                   active:bg-gray-200 transition-colors duration-200"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4 mt-4 text-gray-300">
              <span className="text-1.5xl text-gray-800">Số trẻ em</span>

              <div className="flex items-center gap-2">
                {/* Nút trừ */}
                <button
                  onClick={() => setChild(Math.max(0, child - 1))}
                  className="w-8 h-8 flex items-center justify-center text-xl border border-gray-300 rounded-full hover:bg-gray-100
                   active:bg-gray-200  transition-colors duration-200"
                >
                  −
                </button>

                {/* Số lượng */}
                <span className="text-xl font-semibold w-6 text-center tabular-nums">
                  {child}
                </span>

                {/* Nút cộng */}
                <button
                  onClick={() => setChild(child + 1)}
                  className="w-8 h-8 flex items-center justify-center text-xl border border-gray-300 rounded-full hover:bg-gray-100
                   active:bg-gray-200  transition-colors duration-200"
                >
                  +
                </button>
              </div>
            </div>

            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full mt-4">
              ĐẶT NGAY
            </button>
          </div>
          {/* ===== RIGHT BOOKING end ============================================================================================================ */}

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
      {review.list.length} đánh giá
    </p>
  </div>

  {/* Thanh phần trăm theo số sao */}
  <div className="flex-1 space-y-3 mt-3">
    {[5, 4, 3, 2, 1].map((star) => {
      const count = review.list.filter(r => r.rating === star).length;
      const percent = review.list.length > 0 
        ? Math.round((count / review.list.length) * 100) 
        : 0;

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="reviews-container">
            {review.list.slice(0, visibleReviews).map((item) => (
              <div
                key={item.id}
                className="bg-white border rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                    👤
                  </div>

                  {/* Info */}
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <div className="flex text-yellow-400 text-lg">
                      {"★".repeat(item.rating)}
                      {"☆".repeat(5 - item.rating)}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <p className="mt-4 text-gray-600 text-[15px] leading-relaxed">
                  {item.content}
                </p>
              </div>
            ))}
          </div>

          {/* Nút Xem thêm */}
          {visibleReviews < review.list.length && (
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