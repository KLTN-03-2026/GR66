"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Vui lòng nhập email!");
      return;
    }

    try {
      setLoadingSend(true);

      const res = await fetch(`${API_URL}/api/auth/forgot-password`, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Gửi mã OTP thất bại");
        return;
      }

      setCodeSent(true);
      alert(`Mã OTP đã được gửi đến email: ${email}`);
    } catch (error) {
      console.error("Lỗi gửi OTP:", error);
      alert("Không thể kết nối đến server");
    } finally {
      setLoadingSend(false);
    }
  };

  const handleVerifyForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !otp.trim() || !password.trim() || !confirmPassword.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      setLoadingSubmit(true);

      const res = await fetch(`${API_URL}/api/auth/verify-forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          otp,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Đổi mật khẩu thất bại");
        return;
      }

      alert("Khôi phục mật khẩu thành công!");
      setEmail("");
      setOtp("");
      setPassword("");
      setConfirmPassword("");
      setCodeSent(false);
      window.location.href = "/account/login";
    } catch (error) {
      console.error("Lỗi xác thực OTP:", error);
      alert("Không thể kết nối đến server");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/intro.jpg"
          alt="Mountain background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-8 py-6 text-white">
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

        <div className="flex items-center gap-8 text-sm">
          <nav className="flex gap-8">
            <a href="#" className="hover:text-blue-300 transition">
              VI
            </a>
            <a href="#" className="">
              |
            </a>
            <a href="#" className="hover:text-blue-300 transition">
              VND
            </a>
            <a href="#" className="hover:text-blue-300 transition">
              Mở ứng dụng
            </a>
            <a href="#" className="hover:text-blue-300 transition">
              Trợ giúp
            </a>
            <a href="#" className="hover:text-blue-300 transition">
              Thông tin cá nhân
            </a>
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

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[620px] p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-900">Quên Mật khẩu</h1>
          </div>

          <form className="space-y-5" onSubmit={handleVerifyForgotPassword}>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  ✉️
                </div>
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-black placeholder:text-gray-600"
                />
              </div>

              <button
                type="button"
                onClick={handleSendCode}
                disabled={loadingSend}
                className="px-8 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition whitespace-nowrap disabled:opacity-70"
              >
                {loadingSend ? "Đang gửi..." : "Gửi"}
              </button>
            </div>

            {codeSent && (
              <p className="text-sm text-green-600">
                Mã OTP đã được gửi về email của bạn. Vui lòng kiểm tra hộp thư đến hoặc spam.
              </p>
            )}

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔒
              </div>
              <input
                type="text"
                placeholder="Nhập mã code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-black placeholder:text-gray-600"
              />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔒
              </div>
              <input
                type="password"
                placeholder="Mật khẩu mới"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-black placeholder:text-gray-600"
              />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔒
              </div>
              <input
                type="password"
                placeholder="Xác nhận mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-black placeholder:text-gray-600"
              />
            </div>

            <button
              type="submit"
              disabled={loadingSubmit}
              className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-medium py-4 rounded-2xl transition text-lg disabled:opacity-70"
            >
              {loadingSubmit ? "Đang xác nhận..." : "Xác nhận"}
            </button>
          </form>

          <div className="text-center mt-8">
            <Link
              href="/account/login"
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Quay lại Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}