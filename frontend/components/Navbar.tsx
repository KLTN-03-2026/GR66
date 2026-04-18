"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout } from '@/app/lib/authService';   // ← sửa đường dẫn nếu khác

export default function Navbar() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Lấy thông tin user từ localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");

    if (storedUser && accessToken) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setOpen(false);
    router.push('/');        // Quay về trang chủ sau khi logout
  };

  const goToProfile = () => {
    setOpen(false);
    router.push('/user/profile');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="relative z-10 flex items-center justify-between px-8 py-6">

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
            <a href="#" className="flex items-center gap-1 hover:text-blue-600 transition">🌐 VI</a>
            <a href="#" className="hover:text-blue-600 transition">VND</a>
            <a href="#" className="hover:text-blue-600 transition">Mở ứng dụng</a>
            <a href="#" className="hover:text-blue-600 transition">Trợ giúp</a>
          </div>

          {/* Phần User */}
          {user ? (
            // ĐÃ ĐĂNG NHẬP → Hiện Gmail + Dropdown
            <div className="relative">
              <span
                className="cursor-pointer px-4 py-2 rounded-full hover:bg-gray-100 transition text-gray-700"
                onClick={() => setOpen(!open)}
              >
                {user.email}
              </span>

              {open && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <button
                    onClick={goToProfile}
                    className="block w-full text-left px-5 py-3 hover:bg-gray-100 text-gray-700"
                  >
                    Thông tin tài khoản
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-5 py-3 hover:bg-gray-100 text-red-600"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Chưa đăng nhập → Hiện nút Đăng ký & Đăng nhập
            <div className="flex items-center gap-3">
              <Link
                href="/account/register"
                className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition"
              >
                Đăng ký
              </Link>

              <Link
                href="/account/login"
                className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
              >
                Đăng nhập
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}