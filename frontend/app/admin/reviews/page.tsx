"use client";

import { useEffect, useState } from "react";
import { Trash2, Star, MessageSquare, Users } from "lucide-react";

const API_URL = "http://localhost:3001";

type Review = {
  id: string;
  maID: string;
  tenTour: string;
  userName: string;
  email: string;
  content: string;
  rating: number;
  date: string;
};

export default function AdminReviewsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | "all">("all");
  const [tours, setTours] = useState<{ id: string; name: string }[]>([]);
  const [selectedTour, setSelectedTour] = useState<string>("all");


  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/api/reviews`);
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Lỗi lấy danh sách đánh giá");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mappedReviews: Review[] = result.data.map((item: any) => ({
        id: item._id,

        // ID tour
        maID: item.Tour_Id?._id || "",

        // Tên tour
        tenTour: item.Tour_Id?.tenTour || "Không có tên tour",

        userName: item.User_Name || item.Users_ID?.hoten || "Không có tên",
        email: item.User_Email || item.Users_ID?.email || "Không có email",
        content: item.Noidung || "",
        rating: item.Sosao || 0,
        date: item.Ngaydanhgia || item.createdAt || "",
      }));

      setReviews(mappedReviews);
    } catch (error) {
      console.error("Lỗi fetch reviews:", error);
      alert(error instanceof Error ? error.message : "Lỗi lấy đánh giá");
    }
  };
  const filteredReviews = reviews.filter((review) => {
    const matchSearch =
      review.tenTour.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchRating =
      selectedRating === "all" || review.rating === selectedRating;

    const matchTour =
      selectedTour === "all" || review.maID === selectedTour;

    return matchSearch && matchRating && matchTour;
  });

  useEffect(() => {
    fetchReviews();
    fetchTours();
  }, []);

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xoá đánh giá này không?")) return;

    try {
      const res = await fetch(`${API_URL}/api/reviews/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Xoá đánh giá thất bại");
      }

      setReviews((prev) => prev.filter((review) => review.id !== id));
    } catch (error) {
      console.error("Lỗi xoá review:", error);
      alert(error instanceof Error ? error.message : "Lỗi xoá đánh giá");
    }
  };
  const fetchTours = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tours`);
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Lỗi lấy tour");
      }

      const activeTours = result.data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((tour: any) => tour.trangThai === "Hoạt động") // 🔥 đúng BE
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((tour: any) => ({
          id: tour._id,
          name: tour.tenTour,
        }));

      setTours(activeTours);
    } catch (error) {
      console.error("Lỗi fetch tours:", error);
    }
  };
  const totalReviews = filteredReviews.length;

  const averageRating =
    totalReviews > 0
      ? (
        filteredReviews.reduce((sum, review) => sum + review.rating, 0) /
        totalReviews
      ).toFixed(1)
      : "0";

  const fiveStarReviews = filteredReviews.filter(
    (review) => review.rating === 5
  ).length;



  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Quản lý đánh giá
        </h1>
        <p className="text-gray-500 mt-1">
          Theo dõi và quản lý đánh giá của khách hàng
        </p>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <MessageSquare className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Tổng đánh giá</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalReviews}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
              <Star className="text-yellow-500" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Điểm trung bình</p>
              <p className="text-2xl font-bold text-gray-900">
                {averageRating}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <Users className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Đánh giá 5 sao</p>
              <p className="text-2xl font-bold text-gray-900">
                {fiveStarReviews}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex  mb-4 gap-4">

        {/* Lọc tour */}
        <select
          value={selectedTour}
          onChange={(e) => setSelectedTour(e.target.value)}
          className="border border-gray-300 rounded-full px-4 py-2 text-sm bg-white 
    focus:outline-none focus:ring-0"
        >
          <option value="all">Tất cả tour</option>
          {tours.map((tour) => (
            <option key={tour.id} value={tour.id}>
              {tour.name}
            </option>
          ))}
        </select>

        {/* Lọc số sao */}
        <select
          value={selectedRating}
          onChange={(e) =>
            setSelectedRating(
              e.target.value === "all" ? "all" : Number(e.target.value)
            )
          }
          className="border border-gray-300 rounded-full px-4 py-2 text-sm bg-white 
    focus:outline-none focus:ring-0"
        >
          <option value="all">Tất cả sao</option>
          <option value="5">5 sao</option>
          <option value="4">4 sao</option>
          <option value="3">3 sao</option>
          <option value="2">2 sao</option>
          <option value="1">1 sao</option>
        </select>

        {/* Search */}
        <div className="flex items-center border border-gray-300 rounded-full overflow-hidden w-[350px] bg-white ml-auto">
          <input
            type="text"
            placeholder="Tìm kiếm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 outline-none text-sm"
          />
          <button className="bg-blue-500 text-white px-5 py-2 hover:bg-blue-600 transition">
            Tìm
          </button>
        </div>
      </div>


      {/* Bảng */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-4">Tour</th>
                <th className="px-6 py-4">Người dùng</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Nội dung</th>
                <th className="px-6 py-4">Số sao</th>
                <th className="px-6 py-4">Ngày đánh giá</th>
                <th className="px-6 py-4 text-center">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {filteredReviews.map((review) => (
                <tr
                  key={review.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-6 py-5">
                    <p className="font-mono text-xs text-gray-400">
                      {review.maID}
                    </p>
                    <p className="font-medium text-gray-900 mt-1">
                      {review.tenTour}
                    </p>
                  </td>

                  <td className="px-6 py-5 text-gray-800">
                    {review.userName}
                  </td>

                  <td className="px-6 py-5 text-gray-600">
                    {review.email}
                  </td>

                  <td className="px-6 py-5 text-gray-700 max-w-md">
                    {review.content}
                  </td>

                  <td className="px-6 py-5">
                    <span className="text-yellow-500">
                      {"★".repeat(review.rating)}
                    </span>
                    <span className="text-gray-300">
                      {"★".repeat(5 - review.rating)}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-gray-600">
                    {review.date
                      ? new Date(review.date).toLocaleDateString("vi-VN")
                      : ""}
                  </td>

                  <td className="px-6 py-5 text-center">
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Xoá đánh giá"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}

              {reviews.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    Chưa có đánh giá nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}