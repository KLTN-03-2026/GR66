"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function IntroSection() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/VideoBanner.mp4" type="video/mp4" />
        <img
          src="/intro.jpg"
          alt="Exceptional journeys"
          className="w-full h-full object-cover"
        />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-8 py-6 text-white">
        <Link href="/" className="flex items-center hover:opacity-90 transition">
          <div className="flex items-center">
            <div className="text-2xl text-blue-400 font-bold tracking-wider">DTU_TRAVEL</div>
            <div className="relative -mt-7">
              <Image
                src="/logo.png"
                alt="DTU Travel Logo"
                width={100}
                height={50}
                className="h-20 w-auto"
                priority
              />
            </div>
          </div>
        </Link>

        {/* Menu phải */}
        <div className="flex items-center gap-8 text-sm">
          <nav className="flex gap-8">
            <a href="#" className="hover:text-blue-300 transition">VI</a>
            <a href="#" className="">|</a>
            <a href="#" className="hover:text-blue-300 transition">VND</a>
            <a href="#" className="hover:text-blue-300 transition">Mở ứng dụng</a>
            <a href="#" className="hover:text-blue-300 transition">Trợ giúp</a>
            <a href="#" className="hover:text-blue-300 transition">Thông tin cá nhân</a>
          </nav>

          <Link
            href="/account/register"
            className="px-6 py-2 border border-white rounded-full hover:bg-white hover:text-black transition text-sm"
          >
            Đăng ký
          </Link>

          <Link
            href="/account/login"
            className="px-6 py-2 bg-white text-black rounded-full hover:bg-blue-600 hover:text-white transition text-sm"
          >
            Đăng nhập
          </Link>
        </div>
      </header>

      {/* Nội dung chính */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6 pt-8">   {/* Giảm pt để dịch lên */}

        {/* Tiêu đề - Chỉ dịch lên cao hơn, không thay đổi font size */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-thin tracking-wider leading-none mb-10">
          Những hành trình
          <br />
          <span className="block mt-1">đặc biệt</span>   {/* Giảm mt từ 2 xuống 1 */}
        </h1>

        {/* Mô tả */}
        <p className="text-lg md:text-xl font-light tracking-widest opacity-90 max-w-3xl mx-auto mb-20">
          Bắt đầu những chuyến đi phi thường, đầy tính cá nhân, được lên kế hoạch bởi các chuyên gia đoạt giải
        </p>

        {/* Thanh tìm kiếm rộng */}
        <div className="w-full max-w-3xl mx-auto">
          <div className="relative flex items-center bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl overflow-hidden shadow-xl">
            <div className="flex-1 px-8 py-6">
              <input
                type="text"
                placeholder="Tìm kiếm địa điểm của bạn"
                className="w-full bg-transparent outline-none text-white placeholder-white/70 text-lg"
              />
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-14 py-6 text-lg font-medium transition rounded-r-2xl whitespace-nowrap">
              Khám phá
            </button>
          </div>
        </div>
      </div>

      {/* Scroll down indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/70 flex flex-col items-center">
        <span className="text-sm tracking-widest mb-3">KHÁM PHÁ NGAY</span>
        <div className="w-6 h-10 border-2 border-white/60 rounded-full flex items-center justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}