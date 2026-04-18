"use client";

import React from 'react';
import Image from 'next/image';

const regions = [
  {
    region: "MIỀN BẮC",
    bestTime: "Tháng 3 - Tháng 5 & Tháng 9 - Tháng 11",
    highlight: "Thời điểm vàng để chiêm ngưỡng sắc hoa đào rực rỡ, những cánh đồng bậc thang chín vàng và không khí se lạnh dễ chịu của vùng núi Tây Bắc.",
    image: "/tsmb.jpg",      
  },
  {
    region: "MIỀN TRUNG",
    bestTime: "Tháng 2 - Tháng 8",
    highlight: "Nắng vàng rực rỡ, biển xanh trong vắt, ít mưa. Đây là lúc lý tưởng nhất để khám phá di sản Huế, phố cổ Hội An và những bãi biển Đà Nẵng, Nha Trang.",
    image: "/tsmt.jpg",        
  },
  {
    region: "MIỀN NAM",
    bestTime: "Tháng 12 - Tháng 4",
    highlight: "Mùa khô ấm áp với nắng dịu nhẹ, rất phù hợp cho những chuyến nghỉ dưỡng biển Phú Quốc, khám phá Sài Gòn năng động hay đồng bằng sông Cửu Long.",
    image: "/tsmn.jpg",       
  },
];

export default function TimeSection() {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-screen-2xl mx-auto px-8">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Thời điểm nên du lịch
            </h2>
            <div className="h-1 w-12 bg-orange-500 mt-3"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Nội dung bên trái - 3 miền */}
          <div className="space-y-12">
            {regions.map((item, index) => (
              <div key={index} className="flex gap-6 group">
                
                {/* Ảnh thay vì icon */}
                <div className="flex-shrink-0 w-40 h-40 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                  <Image
                    src={item.image}
                    alt={item.region}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Nội dung text */}
                <div className="flex-1 pt-2">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                    {item.region}
                  </h3>
                  
                  <p className="text-orange-600 font-semibold mb-3">
                    {item.bestTime}
                  </p>
                  
                  <p className="text-gray-600 leading-relaxed text-[15.5px]">
                    {item.highlight}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Hình ảnh lớn bên phải */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[520px]">
            <Image
              src="/ts1.jpg"
              alt="Thời điểm du lịch Việt Nam"
              fill
              className="object-cover"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            
            <div className="absolute bottom-10 left-10 right-10 text-white">
              <p className="text-4xl font-semibold leading-tight">
                Khi nào là thời điểm<br />
                lý tưởng để du lịch<br />
                Việt Nam?
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}