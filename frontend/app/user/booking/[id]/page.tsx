"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Tour = {
  _id: string;
  maTour?: string;
  tenTour: string;
  diaDiem: string;
  hinhAnh: string[];
  thoiLuong: string;
  giaNguoiLon: number;
  giaTreEm: number;
  mota: string;
  diemNoiBat: string;
  loTrinh: string;
  chitietdichvu: string;
  dieuKhoanDichVu: string;
  trangThai: string;
  createdAt?: string;
  updatedAt?: string;
};

const FALLBACK_MAIN = "https://placehold.co/900x520?text=Khong+co+anh";
const FALLBACK_THUMB = "https://placehold.co/300x200?text=Khong+co+anh";

function BookingContent() {
  const params = useParams();
  const id = params?.id as string;

  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);

  const [adult, setAdult] = useState(1);
  const [child, setChild] = useState(0);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkInError, setCheckInError] = useState("");
  const [showFullTerms, setShowFullTerms] = useState(false);
  const [showFullItinerary, setShowFullItinerary] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!id) return;

    const fetchTour = async () => {
      try {
        setLoading(true);

        const res = await fetch(`http://localhost:3001/api/tours/${id}`, {
          cache: "no-store",
        });

        const result = await res.json();

        console.log("ID:", id);
        console.log("API result:", result);

        setTour(result?.data || null);
      } catch (error) {
        console.error("Lỗi lấy chi tiết tour:", error);
        setTour(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;

    if (selectedDate < today) {
      setCheckInError("Không thể chọn ngày trước hôm nay");
      setCheckInDate("");
      return;
    }

    setCheckInError("");
    setCheckInDate(selectedDate);
  };

  const images = useMemo(() => {
    if (!tour?.hinhAnh) return [];

    return tour.hinhAnh
      .map((url) => (typeof url === "string" ? url.trim() : ""))
      .filter(Boolean)
      .map((url) => encodeURI(url));
  }, [tour]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen pb-30">
        <div className="max-w-6xl mx-auto p-6">Đang tải...</div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="bg-gray-50 min-h-screen pb-30">
        <div className="max-w-6xl mx-auto p-6">Không tìm thấy tour</div>
      </div>
    );
  }

  const totalPrice =
    (tour.giaNguoiLon || 0) * adult + (tour.giaTreEm || 0) * child;

  const itineraryList = tour.loTrinh
    ? tour.loTrinh.split("\n").filter((item) => item.trim() !== "")
    : [];

  const termsList = tour.dieuKhoanDichVu
    ? tour.dieuKhoanDichVu.split("\n").filter((item) => item.trim() !== "")
    : [];

  const serviceList = tour.chitietdichvu
    ? tour.chitietdichvu.split("\n").filter((item) => item.trim() !== "")
    : [];

  return (
    <div className="bg-gray-50 min-h-screen pb-30">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-semibold text-gray-800">{tour.tenTour}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {tour.diaDiem} | {tour.thoiLuong}
        </p>

        <div className="grid grid-cols-3 gap-6 mt-6">
          <div className="col-span-2 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-[300px]">
                {images[0] ? (
                  <img
                    key={images[0]}
                    src={images[0]}
                    alt={tour.tenTour}
                    className="w-full h-full rounded-xl object-cover block bg-gray-100"
                    onError={(e) => {
                      console.log("Lỗi ảnh lớn:", images[0]);
                      e.currentTarget.src = FALLBACK_MAIN;
                    }}
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-gray-200 flex items-center justify-center text-gray-500">
                    Không có ảnh
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-3.5">
                {images.slice(1, 5).map((img, index) => (
                  <div key={`${img}-${index}`} className="h-[120px]">
                    <img
                      src={img}
                      alt={`${tour.tenTour}-${index + 1}`}
                      className="w-full h-full rounded-xl object-cover block bg-gray-100"
                      onError={(e) => {
                        console.log("Lỗi ảnh nhỏ:", img);
                        e.currentTarget.src = FALLBACK_THUMB;
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-lg text-gray-800 mb-2">
                Mô tả tour
              </h2>
              <p className="text-gray-500 text-sm">{tour.mota}</p>

              <div className="mt-4 text-sm text-gray-600">
                <p className="font-medium text-gray-800 mb-2">Điểm nổi bật</p>
                <p>{tour.diemNoiBat}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-lg text-gray-800 mb-2">
                Lộ trình
              </h2>

              {itineraryList.length > 0 ? (
                <>
                  <ul className="text-sm text-gray-600 space-y-1 overflow-hidden">
                    {(showFullItinerary
                      ? itineraryList
                      : itineraryList.slice(0, 5)
                    ).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>

                  {itineraryList.length > 5 && (
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => setShowFullItinerary(!showFullItinerary)}
                        className="px-6 py-2.5 bg-blue-500 hover:bg-blue-700 text-white rounded-3xl text-sm font-medium flex items-center gap-2 transition-all active:scale-95"
                      >
                        <span>
                          {showFullItinerary ? "Thu gọn ↑" : "Xem thêm →"}
                        </span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-600">{tour.loTrinh}</p>
              )}
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border">
              <h3 className="font-semibold text-gray-800 mb-3">
                Chi tiết dịch vụ bao gồm
              </h3>

              {serviceList.length > 0 ? (
                <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                  {serviceList.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">{tour.chitietdichvu}</p>
              )}
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h2 className="font-semibold text-lg text-gray-800 mb-3">
                Điều khoản sử dụng
              </h2>

              {termsList.length > 0 ? (
                <>
                  <div className="text-sm text-gray-600 space-y-3">
                    <div>
                      <ul className="list-disc pl-5 space-y-1">
                        {(showFullTerms
                          ? termsList
                          : termsList.slice(0, 4)
                        ).map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {termsList.length > 4 && (
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => setShowFullTerms(!showFullTerms)}
                        className="px-6 py-2.5 bg-blue-500 hover:bg-blue-700 text-white rounded-3xl text-sm font-medium flex items-center gap-2 transition-all active:scale-95"
                      >
                        <span>
                          {showFullTerms ? "Thu gọn ↑" : "Xem thêm →"}
                        </span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-600">{tour.dieuKhoanDichVu}</p>
              )}
            </div>
          </div>

          <div className="bg-white border rounded-2xl p-6 h-fit shadow-sm sticky top-24 z-40">
            <p className="font-semibold text-2xl text-gray-800 mb-6">
              Tổng tiền:{" "}
              <span className="text-blue-600">
                {totalPrice.toLocaleString()} đ
              </span>
            </p>

            <div className="mb-3">
              <span className="text-lg block text-gray-900 font-medium mb-1">
                Check-in
              </span>
              <input
                type="date"
                value={checkInDate}
                min={today}
                onChange={handleCheckInChange}
                className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-400 outline-none text-gray-500"
              />

              {checkInError && (
                <p className="text-red-500 text-sm mt-2">{checkInError}</p>
              )}
            </div>

            <div className="flex justify-between items-center mb-4 mt-6">
              <span className="text-lg text-gray-800">Số người lớn</span>
              <div className="flex items-center gap-2 text-gray-600">
                <button
                  onClick={() => setAdult(Math.max(1, adult - 1))}
                  className="w-8 h-8 flex items-center justify-center text-xl border border-gray-300 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-all"
                >
                  −
                </button>
                <span className="text-xl font-semibold w-8 text-center">
                  {adult}
                </span>
                <button
                  onClick={() => setAdult(adult + 1)}
                  className="w-8 h-8 flex items-center justify-center text-xl border border-gray-300 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-all"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-lg text-gray-800">Số trẻ em</span>
              <div className="flex items-center gap-2 text-gray-600">
                <button
                  onClick={() => setChild(Math.max(0, child - 1))}
                  className="w-8 h-8 flex items-center justify-center text-xl border border-gray-300 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-all"
                >
                  −
                </button>
                <span className="text-xl font-semibold w-8 text-center">
                  {child}
                </span>
                <button
                  onClick={() => setChild(child + 1)}
                  className="w-8 h-8 flex items-center justify-center text-xl border border-gray-300 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-all"
                >
                  +
                </button>
              </div>
            </div>

            <button className="w-full bg-blue-500 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold text-lg transition-all active:scale-95">
              ĐẶT NGAY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TourDetailBody() {
  return (
    <>
      <Navbar />
      <BookingContent />
      <Footer />
    </>
  );
}