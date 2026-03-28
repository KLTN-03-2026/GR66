"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const imageData = [
  { src: "/anhHLS1.jpg", title: "Cầu Rồng Đà Nẵng", desc: "Biểu tượng phun lửa về đêm" },
  { src: "/glr2.jpg", title: "Sapa", desc: "Ruộng bậc thang, săn mây" },
  { src: "/glr3.jpg", title: "Thủ đô Hà Nội", desc: "Phố cổ, hồ Gươm" },
  { src: "/glr10.jpg", title: "Thành phố biển Nha Trang", desc: "Thiên đường biển xanh cát trắng" },
  { src: "/HLS5.jpg", title: "Phố cổ Hội An", desc: "Lồng đèn rực rỡ bên sông Hoài" },
  { src: "/glr9.jpg", title: "Ninh Bình", desc: "Tràng An, núi non hùng vĩ" },
  { src: "/glr7.jpg", title: "Thành phố Hồ Chí Minh", desc: "Năng động, hiện đại" },
];

const GallerySection = () => {
  const [currentIndex, setCurrentIndex] = useState(2);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imageData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + imageData.length) % imageData.length);
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % imageData.length);

  // Hiển thị 5 ảnh, luôn lấy ảnh ở giữa là currentIndex
  const visibleImages = Array.from({ length: 5 }, (_, i) => {
    const index = (currentIndex - 2 + i + imageData.length) % imageData.length;
    return { ...imageData[index], index };
  });

  return (
    <section className="w-full bg-white py-16">
      <div className="relative w-full h-[580px] md:h-[650px] overflow-hidden">

        {/* 5 ảnh căn giữa – chuyển động mượt */}
        <div className="absolute inset-0 flex items-center justify-center px-8 md:px-16">
          <div className="flex items-center gap-6 md:gap-10">
            {visibleImages.map(({ src, title, desc, index }, i) => {
              const isCenter = i === 2;
              const isHovered = hoveredIndex === index;
              const showOverlay = isCenter || isHovered;

              return (
                <div
                  key={index}
                  className="transition-all duration-700 ease-out"
                  style={{
                    transform: `scale(${showOverlay ? 1.1 : 0.85})`,
                    zIndex: showOverlay ? 20 : 10,
                    filter: showOverlay ? "brightness(1.1)" : "brightness(0.9)",
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="relative overflow-hidden rounded-3xl shadow-2xl border-4 border-white/90">
                    <Image
                      src={src}
                      alt={title}
                      width={900}
                      height={1200}
                      className={`object-cover transition-all duration-700 ${
                        showOverlay
                          ? "h-[490px] md:h-[570px] w-[360px] md:w-[440px]"
                          : "h-[420px] md:h-[500px] w-[300px] md:w-[360px]"
                      }`}
                    />

                    {/* Overlay + nội dung – chỉ hiện khi ở giữa hoặc hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent 
                        flex flex-col justify-end p-8 transition-all duration-700 ${
                          showOverlay ? "opacity-100" : "opacity-0"
                        }`}
                    >
                      <h3 className="text-white text-2xl md:text-3xl font-semibold tracking-wide leading-tight">
                        {title}
                      </h3>
                      <p className="text-white/90 text-sm md:text-base mt-2 font-light">
                        {desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Nút trái/phải */}
        <button
          onClick={goPrev}
          className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/95 shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-30 border-2 border-amber-600"
        >
          <ChevronLeft className="w-8 h-8 text-amber-700" />
        </button>

        <button
          onClick={goNext}
          className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/95 shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-30 border-2 border-amber-600"
        >
          <ChevronRight className="w-8 h-8 text-amber-700" />
        </button>

        {/* Dots – cập nhật theo 7 ảnh */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
          {imageData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-500 ${
                index === currentIndex
                  ? "w-12 h-2 bg-amber-600 rounded-full shadow-lg"
                  : "w-2 h-2 bg-white/70 rounded-full hover:bg-white border border-amber-600"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;