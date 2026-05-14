"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

import {
  handleGoogleSuccess,
  handleEmailLogin,
  handleGoogleError,
} from "@/app/lib/authService";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // GOOGLE LOGIN
  const onGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      setLoading(true);
      await handleGoogleSuccess(credentialResponse);
      // lấy trang trước đó
      const redirectUrl =
        localStorage.getItem("redirectAfterLogin") || "/";
      // xoá sau khi dùng
      localStorage.removeItem("redirectAfterLogin");
      // chuyển về trang cũ
      router.push(redirectUrl);

    } catch (error) {
      console.error("Google login error:", error);

      alert("Đăng nhập Google thất bại");
    } finally {
      setLoading(false);
    }
  };

  // GOOGLE ERROR
  const onGoogleError = () => {
    handleGoogleError();

    alert("Google Login Failed");
  };

  // EMAIL LOGIN
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await handleEmailLogin(
        email,
        password,
        rememberMe
      );

      // lấy trang trước đó
      const redirectUrl = localStorage.getItem("redirectAfterLogin") || "/";
      // xoá sau khi dùng
      localStorage.removeItem("redirectAfterLogin");
      // redirect
      router.push(redirectUrl);

    } catch (error: any) {
      console.error("Login error:", error);

      alert(error?.message || "Đăng nhập thất bại");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* BACKGROUND */}
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

      {/* HEADER */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 text-white">

        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center hover:opacity-90 transition"
        >
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

        {/* MENU */}
        <div className="flex items-center gap-8 text-sm">

          <nav className="flex gap-8">

            <a
              href="#"
              className="hover:text-blue-300 transition"
            >
              VI
            </a>

            <a href="#">
              |
            </a>

            <a
              href="#"
              className="hover:text-blue-300 transition"
            >
              VND
            </a>

            <a
              href="#"
              className="hover:text-blue-300 transition"
            >
              Mở ứng dụng
            </a>

            <a
              href="#"
              className="hover:text-blue-300 transition"
            >
              Trợ giúp
            </a>

            <a
              href="#"
              className="hover:text-blue-300 transition"
            >
              Thông tin cá nhân
            </a>

          </nav>

          {/* REGISTER */}
          <Link
            href="/account/register"
            className="px-6 py-2 border border-white rounded-full hover:bg-white hover:text-black transition"
          >
            Đăng ký
          </Link>

          {/* LOGIN */}
          <Link
            href="/account/login"
            className="px-6 py-2 bg-white text-black rounded-full hover:bg-blue-600 hover:text-white transition"
          >
            Đăng nhập
          </Link>

        </div>
      </header>

      {/* LOGIN FORM */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4">

        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[620px] p-10">

          {/* TITLE */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-900">
              Chào mừng trở lại
            </h1>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* EMAIL */}
            <div className="relative">

              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                ✉️
              </div>

              <input
                type="email"
                placeholder="Email của bạn"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-black placeholder:text-gray-600"
                required
              />

            </div>

            {/* PASSWORD */}
            <div className="relative">

              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔒
              </div>

              <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-black placeholder:text-gray-600"
                required
              />

            </div>

            {/* REMEMBER */}
            <div className="flex items-center justify-between text-sm">

              <label className="flex items-center gap-2 cursor-pointer">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                  className="w-4 h-4 accent-blue-500"
                />

                <span className="text-gray-600">
                  Nhớ mật khẩu
                </span>

              </label>

              <Link
                href="/account/forgotpassword"
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Quên mật khẩu?
              </Link>

            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-4 rounded-2xl transition text-lg"
            >
              {loading
                ? "Đang xử lý..."
                : "Đăng Nhập"}
            </button>

            {/* DIVIDER */}
            <div className="relative my-4">

              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>

              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-6 text-gray-500">
                  Hoặc
                </span>
              </div>

            </div>

            {/* GOOGLE */}
            <div className="w-full flex justify-center google-login">

              <GoogleLogin
                onSuccess={onGoogleSuccess}
                onError={onGoogleError}
                theme="outline"
                size="large"
              />

            </div>

          </form>

          {/* REGISTER LINK */}
          <div className="text-center mt-8 text-sm text-gray-600">

            Chưa có tài khoản?{" "}

            <Link
              href="/account/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Đăng ký ngay
            </Link>

          </div>

          {/* FOOTER */}
          <div className="text-center mt-10 text-sm text-gray-500">

            Cần hỗ trợ? Gọi ngay{" "}

            <a
              href="tel:18001094"
              className="text-blue-600 hover:underline font-medium"
            >
              1800 1094
            </a>

          </div>

        </div>
      </div>
    </div>
  );
}