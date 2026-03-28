"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="relative z-10 flex items-center justify-between px-8 py-6 text-white">
        
        {/* Logo + Brand */}
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

        {/* Menu bên phải */}
        <div className="flex items-center gap-10 text-sm text-gray-700">
          <div className="flex items-center gap-8">
            <a href="#" className="flex items-center gap-1 hover:text-blue-600 transition">
              🌐 VI
            </a>
            <a href="#" className="hover:text-blue-600 transition">VND</a>
            <a href="#" className="hover:text-blue-600 transition">Mở ứng dụng</a>
            <a href="#" className="hover:text-blue-600 transition">Trợ giúp</a>
            <a href="#" className="hover:text-blue-600 transition">Thông tin cá nhân</a>
          </div>

          {/* Nút Đăng ký và Đăng nhập */}
          <div className="flex items-center gap-3">
            <Link 
            href="/account/register"
            className="px-6 py-2 border border-white rounded-full hover:bg-gray-400 hover:text-black transition"
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
        </div>
      </div>
    </nav>
  );
}