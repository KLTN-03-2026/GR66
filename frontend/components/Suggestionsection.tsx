"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const suggestions = [
  {
    id: 1,
    region: "MIỀN TRUNG",
    title: "Khám phá Hội An",
    duration: "Hành trình 2 ngày 1 đêm",
    description: "Một hành trình cao cấp đưa bạn đến với vẻ đẹp cổ kính của Hội An, nơi văn hóa, lịch sử và kiến trúc giao thoa tạo nên một sân khấu mê hoặc.",
    price: "799.000",
    image: "/glr9.jpg",
  },
  {
    id: 2,
    region: "MIỀN TRUNG",
    title: "Trải nghiệm Bà Nà Hills",
    duration: "Hành trình 2 ngày 1 đêm",
    description: "Một hành trình cao cấp đưa bạn lên sương mây Bà Nà Hills, nơi vẻ đẹp châu Âu cổ điển hòa quyện cùng thiên nhiên hùng vĩ giữa đại ngàn.",
    price: "799.000",
    image: "/glr9.jpg",
  },

  {
    id: 3,
    region: "MIỀN BẮC",
    title: "Khám phá Vịnh Hạ Long",
    duration: "Hành trình 2 ngày 1 đêm",
    description: "Hành trình khám phá kỳ quan thiên nhiên thế giới Vịnh Hạ Long với những đảo đá hùng vĩ và hang động kỳ bí.",
    price: "1.299.000",
    image: "/glr9.jpg",
  },
  {
    id: 4,
    region: "MIỀN BẮC",
    title: "Sapa - Bản làng Tây Bắc",
    duration: "Hành trình 3 ngày 2 đêm",
    description: "Trải nghiệm văn hóa dân tộc và ngắm ruộng bậc thang tuyệt đẹp tại thị trấn sương mù Sapa.",
    price: "1.499.000",
    image: "/glr9.jpg",
  },

  {
    id: 5,
    region: "MIỀN NAM",
    title: "Khám phá Thành địa Mỹ Sơn",
    duration: "Hành trình 2 ngày 1 đêm",
    description: "Một hành trình cao cấp đưa bạn về với không gian linh thiêng của Thánh địa Mỹ Sơn, nơi lưu giữ những giá trị văn hóa Chăm Pa độc đáo giữa núi rừng.",
    price: "899.000",
    image: "/glr9.jpg",
  },
  {
    id: 6,
    region: "MIỀN NAM",
    title: "Phú Quốc - Thiên đường biển đảo",
    duration: "Hành trình 3 ngày 2 đêm",
    description: "Trải nghiệm nghỉ dưỡng cao cấp tại đảo ngọc Phú Quốc với bãi biển đẹp nhất Việt Nam và vườn quốc gia hoang sơ.",
    price: "2.199.000",
    image: "/glr9.jpg",
  },
];

export default function SuggestionSection() {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-screen-2xl mx-auto px-8">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Gợi ý hành trình
            </h2>
            <div className="h-1 w-12 bg-orange-500 mt-3"></div>
          </div>
        </div>

        {/* Grid 6 thẻ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {suggestions.map((tour) => (
            <div 
              key={tour.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              {/* Ảnh */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={tour.image}
                  alt={tour.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Nội dung */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-orange-600 text-sm mb-3">
                  <span>⏱</span>
                  <span>{tour.duration}</span>
                </div>

                <h3 className="font-semibold text-xl text-gray-900 mb-3 line-clamp-2">
                  {tour.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6">
                  {tour.description}
                </p>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-500">Từ</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {parseInt(tour.price).toLocaleString('vi-VN')} VND
                    </p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                    Xem chi tiết →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}