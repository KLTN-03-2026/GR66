"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const activities = [
  {
    id: 1,
    location: "Đà Nẵng",
    title: "Vé Cáp Treo Sun World Ba Na Hills Đà Nẵng",
    rating: "4.5 (262)",
    reviews: "200K+ Đã được đặt",
    price: "500.000",
    discount: "Giảm 5%",
    image: "/glr2.jpg",  
  },
  {
    id: 2,
    location: "Nha Trang",
    title: "Địa điểm du lịch VinWonders Nha Trang",
    rating: "4.5 (262)",
    reviews: "200K+ Đã được đặt",
    price: "400.000",
    discount: "Giảm 5%",
    image: "/glr2.jpg", 
  },
  {
    id: 3,
    location: "Phú Quốc",
    title: "Công viên SunWorld Hòn Thơm Phú Quốc",
    rating: "4.5 (262)",
    reviews: "200K+ Đã được đặt",
    price: "450.000",
    discount: "Giảm 3%",
    image: "/glr2.jpg", 
  },
  {
    id: 4,
    location: "Quảng Ninh",
    title: "Tour du lịch hấp dẫn cùng vịnh Hạ Long",
    rating: "4.5 (262)",
    reviews: "200K+ Đã được đặt",
    price: "3.500.000",
    discount: "Giảm 15%",
    image: "/glr2.jpg", 
  },
  // Dòng thứ 2 (có thể duplicate hoặc thay ảnh khác)
  {
    id: 5,
    location: "Đà Nẵng",
    title: "Vé Cáp Treo Sun World Ba Na Hills Đà Nẵng",
    rating: "4.5 (262)",
    reviews: "200K+ Đã được đặt",
    price: "500.000",
    discount: "Giảm 5%",
    image: "/glr2.jpg",  
  },
  {
    id: 6,
    location: "Nha Trang",
    title: "Địa điểm du lịch VinWonders Nha Trang",
    rating: "4.5 (262)",
    reviews: "200K+ Đã được đặt",
    price: "400.000",
    discount: "Giảm 5%",
    image: "/glr2.jpg",  
  },
  {
    id: 7,
    location: "Phú Quốc",
    title: "Công viên SunWorld Hòn Thơm Phú Quốc",
    rating: "4.5 (262)",
    reviews: "200K+ Đã được đặt",
    price: "450.000",
    discount: "Giảm 3%",
    image: "/glr2.jpg",  
  },
  {
    id: 8,
    location: "Quảng Ninh",
    title: "Tour du lịch hấp dẫn cùng vịnh Hạ Long",
    rating: "4.5 (262)",
    reviews: "200K+ Đã được đặt",
    price: "3.500.000",
    discount: "Giảm 15%",
    image: "/glr2.jpg", 
  },
];

export default function ActivitySection() {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-screen-2xl mx-auto px-8">   {/* Phần này rộng hơn */}

        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Các hoạt động du lịch
            <div className="h-1 w-12 bg-orange-500 mt-3"></div>
          </h2>
          
          <Link 
            href="#" 
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 text-lg"
          >
            Xem thêm <span className="text-xl">→</span>
          </Link>
        </div>

        {/* Grid hoạt động */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {activities.map((item) => (
            <div 
              key={item.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer"
            >
              {/* Ảnh */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Nội dung - Tất cả chữ đều màu đen */}
              <div className="p-6">
                <p className="text-base font-medium text-gray-900 mb-2">
                  {item.location}
                </p>
                
                <h3 className="font-semibold text-[17px] leading-tight text-gray-900 mb-4 line-clamp-2 min-h-[50px]">
                  {item.title}
                </h3>

                <div className="flex items-center gap-2 mb-5 text-gray-900">
                  <span className="text-yellow-500">★</span>
                  <span className="font-medium">{item.rating}</span>
                  <span className="text-gray-500">• {item.reviews}</span>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Từ</p>
                    <p className="font-bold text-2xl text-gray-900">
                      đ {parseInt(item.price).toLocaleString('vi-VN')}
                    </p>
                  </div>

                  <div className="bg-orange-100 text-orange-600 text-xs font-medium px-4 py-2 rounded-full flex items-center gap-1">
                    🎟️ {item.discount}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}