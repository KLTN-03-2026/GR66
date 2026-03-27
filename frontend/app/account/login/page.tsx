"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/intro.jpg" 
          alt="Mountain background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" /> {/* Overlay tối */}
      </div>

      {/* Header - Giống trang Register */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 text-white">
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
            className="px-6 py-2 border border-white rounded-full hover:bg-white hover:text-black transition"
          >
            Đăng ký
          </Link>

          <Link 
            href="/account/login"
            className="px-6 py-2 bg-white text-black rounded-full hover:bg-blue-600 hover:text-white transition"
          >
            Đăng nhập
          </Link>
        </div>
      </header>

      {/* Login Form */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[620px] p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-900">Chào mừng trở lại</h1>
          </div>

          <form className="space-y-6">
            {/* Email */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                ✉️
              </div>
              <input
                type="email"
                placeholder="Email của bạn"
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
                           text-black placeholder:text-gray-600"
              />
            </div>

            {/* Mật khẩu */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔒
              </div>
              <input
                type="password"
                placeholder="Mật khẩu"
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
                           text-black placeholder:text-gray-600"
              />
            </div>

            {/* Nhớ mật khẩu + Quên mật khẩu */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-blue-500" />
                <span className="text-gray-600">Nhớ mật khẩu</span>
              </label>
                <Link 
                  href="/account/forgotpassword" 
                  className="text-blue-600 hover:underline text-sm font-medium"
                  >
                  Quên mật khẩu?
                </Link>
            </div>

            {/* Nút Đăng Nhập */}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-4 rounded-2xl transition text-lg"
            >
              Đăng Nhập
            </button>

            {/* Hoặc */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-6 text-gray-500">Hoặc</span>
              </div>
            </div>

            {/* Đăng nhập bằng Google */}
            <button
              type="button"
              className="w-full border border-gray-300 hover:bg-gray-50 py-4 rounded-2xl flex items-center justify-center gap-3 transition"
            >
              <img
                src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
                alt="Google"
                className="w-6 h-6"
              />
              <span className="font-medium text-gray-700">Đăng nhập bằng Google</span>
            </button>
          </form>

          {/* Link chuyển sang Đăng ký */}
          <div className="text-center mt-8 text-sm text-gray-600">
            Chưa có tài khoản?{' '}
            <Link href="/account/register" className="text-blue-600 hover:underline font-medium">
              Đăng ký ngay
            </Link>
          </div>

          {/* Footer hỗ trợ */}
          <div className="text-center mt-10 text-sm text-gray-500">
            Cần hỗ trợ? Gọi ngay{' '}
            <a href="tel:18001094" className="text-blue-600 hover:underline font-medium">
              1800 1094
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}