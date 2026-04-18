'use client';

import React, { useState } from 'react';
import { Trash2, Eye } from 'lucide-react';

interface Review {
  id: number;
  hoTen: string;
  email: string;
  danhGiaSao: number;
  maID: string;
  ngayDanhGia: string;
  noiDung: string;
}

const initialReviews: Review[] = [
  {
    id: 1,
    hoTen: "Phạm Văn B",
    email: "levana@gmail.com",
    danhGiaSao: 5,
    maID: "AB1247FG8H",
    ngayDanhGia: "27/6/2025",
    noiDung: "Tour du lịch này được tổ chức rất chuyên nghiệp, lịch trình hợp lý và không bị quá gấp ...",
  },
  {
    id: 2,
    hoTen: "Lê Văn A",
    email: "levana@gmail.com",
    danhGiaSao: 5,
    maID: "AB1247FG8H",
    ngayDanhGia: "27/6/2025",
    noiDung: "Tour du lịch này được tổ chức rất chuyên nghiệp, lịch trình hợp lý và không bị quá gấp ...",
  },
  {
    id: 3,
    hoTen: "Lê Văn A",
    email: "levana@gmail.com",
    danhGiaSao: 4,
    maID: "AB1247FG8H",
    ngayDanhGia: "27/6/2025",
    noiDung: "Tour du lịch này được tổ chức rất chuyên nghiệp, lịch trình hợp lý và không bị quá gấp ...",
  },
  {
    id: 4,
    hoTen: "Lê Văn A",
    email: "levana@gmail.com",
    danhGiaSao: 5,
    maID: "AB1247FG8H",
    ngayDanhGia: "27/6/2025",
    noiDung: "Tour du lịch này được tổ chức rất chuyên nghiệp, lịch trình hợp lý và không bị quá gấp ...",
  },
];

export default function RatingManagement() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStar, setSelectedStar] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.noiDung.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStar = selectedStar === "all" || review.danhGiaSao.toString() === selectedStar;

    return matchesSearch && matchesStar;
  });

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  const currentReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const pageNumbers: (number | string)[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
  } else {
    pageNumbers.push(1);
    if (currentPage > 3) pageNumbers.push('...');
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pageNumbers.push(i);
    if (currentPage < totalPages - 2) pageNumbers.push('...');
    if (totalPages > 1) pageNumbers.push(totalPages);
  }

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
      if (currentReviews.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleView = (review: Review) => {
    alert(`Đánh giá từ ${review.hoTen} (${review.danhGiaSao} sao):\n\n${review.noiDung}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Quản lý đánh giá</h1>

        <div className="bg-emerald-500 text-white rounded-2xl p-8 w-fit mb-8 shadow">
          <div className="text-6xl font-semibold mb-1">{reviews.length}</div>
          <div className="text-lg opacity-90">Tổng đánh giá</div>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 relative max-w-md">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 text-gray-700 placeholder-gray-400"
            />
          </div>

          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-2xl px-5 py-3 shadow-sm whitespace-nowrap">
            <span className="text-gray-500 text-sm">Số sao</span>
            <select
              value={selectedStar}
              onChange={(e) => setSelectedStar(e.target.value)}
              className="bg-transparent outline-none text-gray-700 font-medium cursor-pointer pr-8"
            >
              <option value="all">Tất cả</option>
              <option value="5">5 sao</option>
              <option value="4">4 sao</option>
              <option value="3">3 sao</option>
              <option value="2">2 sao</option>
              <option value="1">1 sao</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-6 py-4 text-left font-medium text-gray-600">Họ tên</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-600">Email</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-600">Đánh giá số sao</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-600">ID</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-600">Ngày đánh giá</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-600">Nội dung đánh giá</th>
                  <th className="px-6 py-4 text-center font-medium text-gray-600 w-24">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="px-6 py-5 font-semibold text-gray-900">{review.hoTen}</td>
                    <td className="px-6 py-5 text-gray-600">{review.email}</td>
                    <td className="px-6 py-5">
                      <span className="text-amber-500 font-semibold flex items-center gap-1">
                        {review.danhGiaSao} ★
                      </span>
                    </td>
                    <td className="px-6 py-5 font-mono text-sm text-gray-500">{review.maID}</td>
                    <td className="px-6 py-5 text-gray-600">{review.ngayDanhGia}</td>
                    <td className="px-6 py-5 text-gray-600 text-sm line-clamp-2 max-w-md">
                      {review.noiDung}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => handleView(review)}
                          className="text-blue-600 hover:text-blue-700 transition p-1"
                          title="Xem chi tiết"
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="text-red-500 hover:text-red-600 transition p-1"
                          title="Xóa đánh giá"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-center gap-2 py-8 border-t">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              ←
            </button>

            {pageNumbers.map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition ${page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 hover:bg-gray-100'
                  }`}
                disabled={page === '...'}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              →
            </button>
          </div>
        </div>

        <div className="mt-12 text-sm text-gray-500 flex justify-between">
          <div>2026 © Duy Tan University</div>
          <div>Phát triển bởi Travel-Team</div>
        </div>
      </div>
    </div>
  );
}