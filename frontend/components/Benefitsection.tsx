"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const benefits = [
  {
    id: 1,
    image: "/bs1.png",          
    title: "Xem blog của DTU_Travel",
    description: "DTU_Travel gợi ý cho bạn các xu hướng du lịch, lịch trình chi tiết và gợi ý hữu ích",
    buttonText: "Xem ngay",
    buttonLink: "/blog",
  },
  {
    id: 2,
    image: "/bs2.png",             
    title: "Tiết kiệm hơn với DTU_Travel Xu",
    description: "Tìm hiểu cách hoạt động với giá siêu tiết kiệm bằng cách để lại đánh giá",
    buttonText: "DTU_Travel Xu là gì?",
    buttonLink: "#",
  },
  {
    id: 3,
    image: "/bs3.png",      
    title: "Nhận ưu đãi khi mời bạn bè",
    description: "Sau khi bạn cầu bạn đăng ký và hoàn thành đơn đăng ký đầu tiên, bạn sẽ nhận được 100.000 điểm thưởng",
    buttonText: "Mời bạn bè",
    buttonLink: "#",
  },
];

export default function BenefitSection() {
  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-screen-2xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 group border-2 border-gray-300" 
            >
              {/* Ảnh minh họa */}
              <div className="relative h-56 mb-8 flex items-center justify-center bg-gray-50 rounded-2xl overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Nội dung */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 leading-tight min-h-[56px]">
                  {item.title}
                </h3>

                <p className="text-gray-600 text-[15px] leading-relaxed mb-8 min-h-[84px]">
                  {item.description}
                </p>

                {/* Button */}
                <Link
                  href={item.buttonLink}
                  className="inline-block border border-gray-500 hover:bg-blue-400 hover:text-black text-gray-800 font-medium px-8 py-3 rounded-full text-sm transition-all duration-300"
                >
                  {item.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}