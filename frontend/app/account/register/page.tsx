"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { handleGoogleSuccess,handleEmailSignup, handleEmailLogin, handleGoogleError } from '@/lib/authService';

export default function RegisterPage() {
  const [role, setRole] = useState('user'); // Mặc định là user
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hoten, setHoten] = useState('');
  const [sdt, setSdt] = useState('');
  const [gioitinh, setGioitinh] = useState('');
  const [diachi, setDiachi] = useState('');
  const [ngaysinh, setNgaysinh] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');



  const onGoogleSuccess = async (credentialResponse: CredentialResponse) => { //credentialResponse = dữ liệu Google trả về sau khi loginKiểu: CredentialResponse

    await handleGoogleSuccess(credentialResponse); // Nhận credentialResponse,Gửi vào handleGoogleSuccess
  };

  const onGoogleError = () => {
    handleGoogleError();
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleEmailSignup(role,hoten,email, password,sdt,gioitinh, diachi, ngaysinh,confirmPassword);
  };

 

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

      {/* Header */}
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

      {/* Register Form */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[620px] p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-900">Đăng ký tài khoản</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              {/* Họ và tên */}
              <div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    👤
                  </div>
                  <input
                    type="text"
                    placeholder="Họ và tên"
                    value={hoten}
                    onChange={(e) => setHoten(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
                               text-black placeholder:text-gray-600"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    ✉️
                  </div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
                               text-black placeholder:text-gray-600"
                  />
                </div>
              </div>

              {/* Số điện thoại */}
              <div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    📞
                  </div>
                  <input
                    type="tel"
                    placeholder="Số điện thoại"
                    value={sdt}
                    onChange={(e) => setSdt(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
                               text-black placeholder:text-gray-600"
                  />
                </div>
              </div>

              {/* Ngày sinh */}
              <div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    📅
                  </div>
                  <input
                    type="text"
                    placeholder="dd/mm/yy"
                    value={ngaysinh}
                    onChange={(e) => setNgaysinh(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
                               text-black placeholder:text-gray-600"
                  />
                </div>
              </div>

              {/* Giới tính */}
              <div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    ⚤
                  </div>
                  <select 
                  value={gioitinh}
                  onChange={(e) => setGioitinh(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
                               text-black bg-white"
                  >
                    <option value="" className="text-gray-500">Giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nu">Nữ</option>
                  </select>
                </div>
              </div>

              {/* Địa chỉ */}
              <div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    📍
                  </div>
                  <input
                    type="text"
                    placeholder="Địa chỉ"
                    value={diachi}
                    onChange={(e) => setDiachi(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
                               text-black placeholder:text-gray-600"
                  />
                </div>
              </div>

              {/* Mật khẩu */}
              <div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    🔒
                  </div>
                  <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
                               text-black placeholder:text-gray-600"
                  />
                </div>
              </div>

              {/* Xác nhận mật khẩu */}
              <div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    🔒
                  </div>
                  <input
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
                               text-black placeholder:text-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Nút Đăng ký */}
            <button
              type="submit"
              className="w-full mt-8 bg-blue-500 hover:bg-blue-600 text-white font-medium py-4 rounded-2xl transition text-lg"
            >
              Đăng ký
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

            {/* Đăng ký bằng Google */}
            <div className="w-full flex justify-center google-login">
              <GoogleLogin
                onSuccess={onGoogleSuccess}
                onError={onGoogleError}
                theme="outline"
                size="large"
              />
            </div>
          </form>

          {/* Footer */}
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