"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { checkTokenExpiration, logout } from "@/app/lib/authService";

export default function Navbar() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    checkTokenExpiration();

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 font-sans">
      <div className="relative z-10 flex items-center justify-between px-8 py-6">

        {/* Logo + Brand */}
        <Link
          href="/"
          className="flex items-center hover:opacity-90 transition"
        >
          <div className="flex items-center">
            <Image
              src="/Logodtu.png"
              alt="Logo"
              width={230}
              height={230}
              className="mr-3 m-0 translate-x-[40px] translate-y-[-10px]"
            />
          </div>
        </Link>

        {/* Menu bên phải */}
        <div className="flex items-center gap-10 text-base text-black">

          <div className="flex items-center gap-8">

            <a
              href="#"
              className="flex items-center gap-1 hover:text-blue-600 transition"
            >
              🌐 VI
            </a>

            <a
              href="#"
              className="hover:text-blue-600 transition"
            >
              VND
            </a>

            <a
              href="#"
              className="hover:text-blue-600 transition"
            >
              Mở ứng dụng
            </a>

            <a
              href="#"
              className="hover:text-blue-600 transition"
            >
              Trợ giúp
            </a>

            <a
              href="#"
              className="hover:text-blue-600 transition"
            >
              Thông tin cá nhân
            </a>
          </div>

          {user ? (
            // Nếu đã đăng nhập
            <div className="relative">

              {/* Email */}
              <span
                className="text-black text-basecursor-pointer"
                onClick={() => setOpen(!open)}
              >
                {user.email}
              </span>

              {/* Menu xổ xuống */}
              {open && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">

                  <button className="block w-full text-left px-4 py-3 text-black hover:bg-gray-100 transition">
                    Thông tin tài khoản
                  </button>

                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-3 text-red-500 hover:bg-gray-100 transition"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Nếu chưa đăng nhập
            <>
              <Link
                href="/account/register"
                className="px-6 py-2 border border-black rounded-full hover:bg-black hover:text-white transition"
              >
                Đăng ký
              </Link>

              <Link
                href="/account/login"
                className="px-6 py-2 bg-black text-white rounded-full hover:bg-blue-600 transition"
              >
                Đăng nhập
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}