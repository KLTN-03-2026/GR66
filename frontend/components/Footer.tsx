"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-400 pt-16 pb-12">
      <div className="max-w-screen-2xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Cột 1: VỀ KLOOK */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-gray-900">VỀ DTU_TRAVEL</h3>
            <ul className="space-y-3 text-gray-600">
              <li><Link href="#" className="hover:text-gray-900 transition">Về chúng tôi</Link></li>
              <li><Link href="#" className="hover:text-gray-900 transition">DTU_Travel Blog</Link></li>
              <li><Link href="#" className="hover:text-gray-900 transition">Cơ hội nghề nghiệp</Link></li>
              <li><Link href="#" className="hover:text-gray-900 transition">Phiếu quà tặng Klook</Link></li>
              <li><Link href="#" className="hover:text-gray-900 transition">Du lịch bền vững</Link></li>
            </ul>
          </div>

          {/* Cột 2: ĐỐI TÁC */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-gray-900">ĐỐI TÁC</h3>
            <ul className="space-y-3 text-gray-600">
              <li><Link href="#" className="hover:text-gray-900 transition">Đăng ký nhà cung cấp</Link></li>
              <li><Link href="#" className="hover:text-gray-900 transition">Đối tác đăng nhập</Link></li>
              <li><Link href="#" className="hover:text-gray-900 transition">Đối tác liên kết</Link></li>
              <li><Link href="#" className="hover:text-gray-900 transition">Chương trình cho người nổi tiếng</Link></li>
              <li><Link href="#" className="hover:text-gray-900 transition">Chương trình cho đại lý</Link></li>
              <li><Link href="#" className="hover:text-gray-900 transition">Hợp tác với Klook</Link></li>
            </ul>
          </div>

          {/* Cột 3: ĐIỀU KHOẢN SỬ DỤNG */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-gray-900">ĐIỀU KHOẢN SỬ DỤNG</h3>
            <ul className="space-y-3 text-gray-600">
              <li><Link href="#" className="hover:text-gray-900 transition">Điều khoản sử dụng</Link></li>
              <li><Link href="#" className="hover:text-gray-900 transition">Chính sách bảo mật của Klook</Link></li>
              <li><Link href="#" className="hover:text-gray-900 transition">Chính sách Cookie</Link></li>
              <li><Link href="#" className="hover:text-gray-900 transition">Chương trình thưởng phát hiện lỗi phần mềm</Link></li>
              <li><Link href="#" className="hover:text-gray-900 transition">Chính sách và quy định</Link></li>
              <li><Link href="#" className="hover:text-gray-900 transition">Chính sách Phúc lợi động vật</Link></li>
            </ul>
          </div>

          {/* Cột 4: KÊNH THÔNG TIN */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-gray-900">KÊNH THÔNG TIN</h3>
            
            <div className="flex gap-6">
              <Link href="#" className="hover:opacity-80 transition">
                <Image 
                  src="/fb.png" 
                  alt="Facebook" 
                  width={55} 
                  height={55} 
                />
              </Link>
              <Link href="#" className="hover:opacity-80 transition">
                <Image 
                  src="/ig.png" 
                  alt="Instagram" 
                  width={32} 
                  height={32} 
                />
              </Link>
              <Link href="#" className="hover:opacity-80 transition">
                <Image 
                  src="/tt.png" 
                  alt="TikTok" 
                  width={32} 
                  height={32} 
                />
              </Link>
            </div>

            {/* Logo DTU_Travel */}
            <div className="flex items-center">
                            <div className="text-2xl text-blue-400 font-bold tracking-wider">DTU_TRAVEL</div>
                            <div className="relative">
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
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-16 pt-8 text-center text-gray-500 text-sm">
          © 2026 DTU_Travel. All rights reserved.
        </div>
      </div>
    </footer>
  );
}