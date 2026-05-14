"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, MapPin, Package, CreditCard, Star, Gift, BarChart3 } from "lucide-react";
import Image from "next/image";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { href: "/admin", icon: Home, label: "Trang chủ" },
    { href: "/admin/users", icon: Users, label: "Quản lý tài khoản" },
    { href: "/admin/tours", icon: MapPin, label: "Quản lý tour" },
    { href: "/admin/bookings", icon: Package, label: "Quản lý đặt tour" },
    { href: "/admin/payments", icon: CreditCard, label: "Quản lý thanh toán" },
    { href: "/admin/reviews", icon: Star, label: "Quản lý đánh giá" },
    { href: "/admin/promotions", icon: Gift, label: "Quản lý khuyến mãi" },
    { href: "/admin/services", icon: Package, label: "Quản lý gói dịch vụ" },
    { href: "/admin/reports", icon: BarChart3, label: "Báo cáo thống kê" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0F172A] text-white flex flex-col">
        {/* Logo DTU_TRAVEL - Dùng đúng phần bạn cung cấp */}
        <div className="p-8 border-b border-gray-700">
          <Link href="http://localhost:3000/admin" className="flex items-center hover:opacity-90 transition">
            <div className="flex items-center">
              <div className="relative -mt-7">
                <Image
                  src="/LogoWeb.png"
                  alt="DTU Travel Logo"
                  width={100}
                  height={50}
                  className="h-20 w-auto"
                  priority
                />
              </div>
            </div>
          </Link>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-6 py-8">
          <p className="text-gray-400 text-sm font-medium mb-4 px-4">MENU</p>
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-lg font-medium transition-all ${
                    isActive 
                      ? "bg-[#00AEEF] text-white shadow-lg" 
                      : "hover:bg-gray-800 text-gray-300"
                  }`}
                >
                  <item.icon className={`w-6 h-6 ${isActive ? "text-white" : "text-gray-400"}`} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer Sidebar */}
        <div className="p-6 border-t border-gray-700 text-center text-xs text-gray-500">
          © 2026 DTU_Travel<br />
          Phát triển bởi Travel-Team
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-10">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-gray-800">Bảng điều khiển</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-1.5 rounded-full">
              <div className="w-7 h-5 bg-red-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">VN</div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-full transition">
                <span className="text-xl">🔄</span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition">
                <span className="text-xl">🌙</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-medium text-sm">Admin</p>
                  <p className="text-xs text-gray-500">Tài khoản Demo</p>
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  A
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-10">
          {children}
        </main>
      </div>
    </div>
  );
}