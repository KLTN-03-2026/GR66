"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams  } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  // ref dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // lấy user từ localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // click ngoài => đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);


    // lưu trang hiện tại
    const handleLogin = () => {
      localStorage.setItem("redirectAfterLogin", pathname);
      router.push("/login");
    };

    const handleRegister = () => {
      localStorage.setItem("redirectAfterLogin", pathname);
      router.push("/register");
    };

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.location.href = "/account/login";
  };


  // Tạo full URL bao gồm query string
  const fullPath = searchParams.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname;

  
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="relative z-10 flex items-center justify-between px-8 py-6 text-white">

        {/* Logo + Brand */}
        <Link href="/" className="flex items-center hover:opacity-90 transition">
          <div className="flex items-center">
            <div className="text-2xl text-blue-400 font-bold tracking-wider">
              DTU_TRAVEL
            </div>

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
        <div className="flex items-center gap-10 text-base text-black">
          <div className="flex items-center gap-8">
            <a href="#" className="flex items-center gap-1 hover:text-blue-600 transition">
              🌐 VI
            </a>

            <a href="#" className="hover:text-blue-600 transition">
              VND
            </a>

            <a href="#" className="hover:text-blue-600 transition">
              Mở ứng dụng
            </a>

            <a href="#" className="hover:text-blue-600 transition">
              Trợ giúp
            </a>

            <a href="http://localhost:3000/user/invoice" className="hover:text-blue-600 transition">
              Hóa đơn của bạn
            </a>
          </div>

          {/* User */}
          <div
            className="flex items-center gap-3 relative"
            ref={dropdownRef}
          >
            {user ? (
              <>
                {/* Email */}
                <div
                  onClick={() => setOpen(!open)}
                  className="cursor-pointer"
                >
                  {user.email}
                </div>

                {/* Dropdown */}
                {open && (
                  <div className="absolute top-full right-0 mt-2 w-44 bg-black/70 backdrop-blur-md rounded shadow-lg overflow-hidden">
                    <Link
                      href="/user/profile"
                      className="block w-full text-left px-5 py-3 text-white hover:bg-white/20 transition"
                    >
                      Thông tin tài khoản
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-5 py-3 text-red-300 hover:bg-white/20 transition"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    localStorage.setItem("redirectAfterLogin", fullPath);
                    router.push("/account/register");
                  }}
                  className="px-6 py-2 border border-white rounded-full hover:bg-gray-400 hover:text-black transition"
                >
                  Đăng ký
                </button>

                <button
                  onClick={() => {
                    localStorage.setItem("redirectAfterLogin", fullPath);
                    router.push("/account/login");
                  }}
                  className="px-6 py-2 bg-white text-black rounded-full hover:bg-blue-600 hover:text-white transition"
                >
                  Đăng nhập
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}