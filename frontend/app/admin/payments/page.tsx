"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Eye,
  Lock,
  Pencil,
  Search,
  Trash2,
  Unlock,
  X,
  User,
  LogOut,
} from "lucide-react";

type PaymentStatus = "Chờ thanh toán" | "Đã thanh toán";

type PaymentItem = {
  id: string;
  bookingId: string;
  fullName: string;
  email: string;
  phone: string;
  tourCode: string;
  tourName: string;
  amount: number;
  paymentDate: string;
  status: PaymentStatus;
  ngaydi: string;
  ngayketthuc: string;
  soLuongNguoiLon: number;
  soLuongTreEm: number;
   nganHang: string;      
  maGiaoDich: string;    
};

type PaymentForm = {
  fullName: string;
  email: string;
  phone: string;
  tourCode: string;
  amount: string;
  paymentDate: string;
  status: PaymentStatus;
};

type UserInfo = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
};

const ITEMS_PER_PAGE = 4;
const API_BASE_URL = "http://localhost:3001/api";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatMoney(value: number) {
  return value.toLocaleString("vi-VN");
}

function formatDisplayDate(date: string) {
  if (!date) return "";
  // Nếu là định dạng "20260506084811" (14 ký tự số)
  if (/^\d{14}$/.test(date)) {
    const day = date.substring(6, 8);
    const month = date.substring(4, 6);
    const year = date.substring(0, 4);
    return `${day}/${month}/${year}`;
  }
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

function matchesDateRange(date: string, fromDate: string, toDate: string) {
  if (!fromDate && !toDate) return true;
  if (fromDate && date < fromDate) return false;
  if (toDate && date > toDate) return false;
  return true;
}

function createEmptyForm(): PaymentForm {
  return {
    fullName: "",
    email: "",
    phone: "",
    tourCode: "",
    amount: "",
    paymentDate: "",
    status: "Chờ thanh toán",
  };
}

// ─── API ─────────────────────────────────────────────────────────────────────

async function fetchUserBookings(): Promise<any[]> {
  console.log("=== fetchAllBookings BẮT ĐẦU ===");
  
  try {
    const token = localStorage.getItem("accessToken");
    
    const url = `${API_BASE_URL}/tours/booking/viewBooking`;
    console.log("=== FETCH URL ===", url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("response.status:", response.status);

    const data = await response.json();
    console.log("=== DATA TRẢ VỀ ===", data);

    return data.data || data.bookings || (Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("=== LỖI ===", error);
    return [];
  }
}

/**
 * Map raw booking từ API sang PaymentItem.
 * Backend endpoint /tours/booking/user/:id populate cả userId và tourId,
 * nên ta đọc thông tin user từ booking.userId (object).
 * Fallback về userInfo từ localStorage nếu backend chưa populate.
 */
function mapApiToPaymentItem(booking: any, userInfo: UserInfo | null): PaymentItem | null {
  try {
    const u = booking.userId ?? {};

    // Họ tên — backend có thể dùng nhiều field khác nhau
    const fullName =
      u.hoten ||
      u.tenKhachHang ||
      "—";

    const email =
      u.email ||
      userInfo?.email ||
      "—";

    const phone =
      u.sdt ||  
      u.phone ||
      u.phoneNumber ||
      userInfo?.phone ||
      "—";


    const t = booking.tourId ?? {};
    const tourName = t.tenTour || t.name || "—";
    // Ưu tiên maTour, fallback 8 ký tự cuối của _id
    const tourCode = t.maTour || (t._id ? String(t._id).slice(-8) : "—");

    // Ngày thanh toán — có thể là string dạng "20260506084811" hoặc ISO date
    const rawDate: string = booking.ngayThanhToan || booking.ngaydat || "";

    // Trạng thái thanh toán
    const trangThaiThanhToan: string = booking.trangThaiThanhToan || "";
    const status: PaymentStatus =
      trangThaiThanhToan === "Đã thanh toán" ? "Đã thanh toán" : "Chờ thanh toán";

    return {
      id: booking._id || "",
      bookingId: booking._id || "",
      fullName,
      email,
      phone,
      tourCode,
      tourName,
      amount: booking.tongTien ?? booking.tongtien ?? 0,
      paymentDate: rawDate,
      status,
      ngaydi: booking.scheduleId?.ngaykhoihanh || booking.ngaydi || "",
      ngayketthuc: booking.scheduleId?.ngayketthuc || booking.ngayketthuc || "",
      soLuongNguoiLon: booking.soluongnguoilon ?? 0,
      soLuongTreEm: booking.soluongtreem ?? 0,
      nganHang: booking.nganHang || "Chưa thanh toán",      
      maGiaoDich: booking.maGiaoDich || "Chưa thanh toán",  
    };
  } catch (error) {
    console.error("Error mapping booking:", booking, error);
    return null;
  }
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className: string;
}) {
  return (
    <div className={`h-[116px] rounded-[10px] px-5 py-4 text-white ${className}`}>
      <div className="text-[28px] font-bold leading-none">{value}</div>
      <div className="mt-4 text-[17px] font-semibold leading-none">{label}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: PaymentStatus }) {
  const isPaid = status === "Đã thanh toán";
  return (
    <span
      className={`inline-flex min-w-[90px] items-center justify-center rounded-md px-3 py-[4px] text-[11px] font-semibold ${
        isPaid ? "bg-[#CCF4EC] text-[#13B89B]" : "bg-[#FFE2E2] text-[#FF5C5C]"
      }`}
    >
      {status}
    </span>
  );
}

function ModalOverlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      {children}
    </div>
  );
}

function DetailBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-[#E5E7EB] bg-[#FAFAFA] p-4">
      <div className="text-sm font-semibold text-[#6B7280]">{label}</div>
      <div className="mt-1 text-[16px] font-medium text-[#111827]">{value || "-"}</div>
    </div>
  );
}

function RoundedInput({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`h-[50px] w-full rounded-[12px] border border-[#444] bg-white px-4 text-[16px] text-black outline-none placeholder:text-[#444] ${className}`}
    />
  );
}

function DateInput({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="date"
      {...props}
      className={`h-[50px] w-full rounded-[12px] border border-[#444] bg-white px-4 text-[16px] text-black outline-none ${className}`}
    />
  );
}

function RoundedSelect({
  className = "",
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`h-[50px] w-full rounded-[12px] border border-[#444] bg-white px-4 text-[16px] text-black outline-none ${className}`}
    />
  );
}

function ErrorText({ text }: { text: string }) {
  return <p className="mt-1 text-sm text-red-500">{text}</p>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [viewItem, setViewItem] = useState<PaymentItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<PaymentItem | null>(null);
  const [editingItem, setEditingItem] = useState<PaymentItem | null>(null);
  const [form, setForm] = useState<PaymentForm>(createEmptyForm());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // ── Fetch data ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Lấy thông tin user từ localStorage
        let currentUser: UserInfo | null = null;
        const userData = localStorage.getItem("user");
        if (userData) {
          const p = JSON.parse(userData);
          currentUser = {
            id: p._id || p.id || 0,
            fullName: p.tenKhachHang || p.hoTen || p.fullName || p.name || "Người dùng",
            email: p.email || "",
            phone: p.soDienThoai || p.phone || "",
            role: p.role || p.vaiTro || "user",
            avatar: p.avatar || "",
          };
          setUserInfo(currentUser);
        }

        // 2. Fetch bookings từ API
        const bookings = await fetchUserBookings();

        if (bookings.length > 0) {
          const mapped = bookings
            .map((b) => mapApiToPaymentItem(b, currentUser))
            .filter((item): item is PaymentItem => item !== null);
          setPayments(mapped);
        }
        // Nếu API trả về rỗng → giữ payments = [] (không fallback demo)
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ── Derived state ───────────────────────────────────────────────────────────
  const filteredPayments = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return payments.filter((item) => {
      const matchedKeyword =
        !keyword ||
        item.fullName.toLowerCase().includes(keyword) ||
        item.email.toLowerCase().includes(keyword) ||
        item.phone.toLowerCase().includes(keyword) ||
        item.tourCode.toLowerCase().includes(keyword) ||
        item.tourName.toLowerCase().includes(keyword) ||
        item.status.toLowerCase().includes(keyword) ||
        formatMoney(item.amount).includes(keyword);
      const matchedDate = matchesDateRange(item.paymentDate, fromDate, toDate);
      return matchedKeyword && matchedDate;
    });
  }, [payments, searchTerm, fromDate, toDate]);

  const totalBookedTours = filteredPayments.length;
  const pendingCount = filteredPayments.filter((i) => i.status === "Chờ thanh toán").length;
  const confirmedCount = filteredPayments.filter((i) => i.status === "Đã thanh toán").length;
  const totalRevenue = filteredPayments
    .filter((i) => i.status === "Đã thanh toán")
    .reduce((sum, i) => sum + i.amount, 0);

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / ITEMS_PER_PAGE));
  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPayments.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPayments, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, fromDate, toDate]);
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [currentPage, totalPages]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleToggleStatus = (id: string) => {
    setPayments((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "Đã thanh toán" ? "Chờ thanh toán" : "Đã thanh toán" }
          : item
      )
    );
  };

  const handleDeleteConfirm = () => {
    if (!deleteItem) return;
    setPayments((prev) => prev.filter((item) => item.id !== deleteItem.id));
    setDeleteItem(null);
  };

  const openEditModal = (item: PaymentItem) => {
    setEditingItem(item);
    setFormErrors({});
    setForm({
      fullName: item.fullName,
      email: item.email,
      phone: item.phone,
      tourCode: item.tourCode,
      amount: String(item.amount),
      paymentDate: item.paymentDate,
      status: item.status,
    });
  };

  const closeEditModal = () => {
    setEditingItem(null);
    setForm(createEmptyForm());
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.fullName.trim()) errors.fullName = "Vui lòng nhập họ tên";
    if (!form.email.trim()) errors.email = "Vui lòng nhập email";
    if (!form.phone.trim()) errors.phone = "Vui lòng nhập số điện thoại";
    if (!form.tourCode.trim()) errors.tourCode = "Vui lòng nhập mã tour";
    if (!form.amount.trim()) errors.amount = "Vui lòng nhập tổng tiền";
    if (!form.paymentDate.trim()) errors.paymentDate = "Vui lòng chọn ngày thanh toán";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveEdit = () => {
    if (!editingItem || !validateForm()) return;
    setPayments((prev) =>
      prev.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              fullName: form.fullName.trim(),
              email: form.email.trim(),
              phone: form.phone.trim(),
              tourCode: form.tourCode.trim(),
              amount: Number(form.amount) || 0,
              paymentDate: form.paymentDate,
              status: form.status,
            }
          : item
      )
    );
    closeEditModal();
  };

  const handleLogout = () => {
    ["user", "userInfo", "currentUser", "auth", "token", "accessToken"].forEach((k) =>
      localStorage.removeItem(k)
    );
    setUserInfo(null);
    window.location.href = "/login";
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#F5F6F8]">
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-700">Đang tải dữ liệu thanh toán...</div>
          <div className="mt-2 text-sm text-gray-500">Vui lòng đợi trong giây lát</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F5F6F8] px-4 py-6 md:px-6 lg:px-8">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-[36px] font-semibold tracking-tight text-[#111827]">
            Quản lý thanh toán
          </h1>
          {userInfo && (
            <div className="flex items-center gap-4 rounded-lg bg-white px-4 py-2 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#5D75E7] to-[#7659E8]">
                {userInfo.avatar ? (
                  <img src={userInfo.avatar} alt={userInfo.fullName} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <User className="h-5 w-5 text-white" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#111827]">{userInfo.fullName}</span>
                <span className="text-xs text-[#6B7280]">{userInfo.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-red-500 hover:bg-red-50"
                title="Đăng xuất"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Stat Cards */}
        <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard value={String(totalBookedTours)} label="Số lượng tour đã đặt" className="bg-[#5D75E7]" />
          <StatCard value={String(pendingCount)} label="Trạng thái chờ xác nhận" className="bg-[#EC8A57]" />
          <StatCard value={String(confirmedCount)} label="Trạng thái đã xác nhận" className="bg-[#7659E8]" />
          <StatCard value={formatMoney(totalRevenue)} label="Tổng doanh thu" className="bg-[#42C3A2]" />
        </div>

        {/* Search + Date filter */}
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex w-full max-w-[390px] overflow-hidden rounded-[10px] border border-[#A8ADB7] bg-white">
            <div className="flex flex-1 items-center px-4">
              <Search className="mr-2 h-4 w-4 text-[#8B93A3]" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email, tour..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-[38px] w-full border-none bg-transparent text-[14px] text-[#111827] outline-none placeholder:text-[#A3A3A3]"
              />
            </div>
            <button className="h-[38px] bg-[#10B5F1] px-4 text-[14px] font-semibold text-white">
              Tìm
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-[38px] rounded-[10px] border border-[#A8ADB7] bg-white px-4 text-[14px] text-[#111827] outline-none"
            />
            <span className="text-[14px] text-[#6B7280]">đến</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-[38px] rounded-[10px] border border-[#A8ADB7] bg-white px-4 text-[14px] text-[#111827] outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] table-fixed">
              <thead>
                <tr className="h-[52px] border-b border-[#EEF1F5] text-left">
                  <th className="px-4 text-[13px] font-bold text-[#444]">Họ tên</th>
                  <th className="px-3 text-[13px] font-bold text-[#444]">Email</th>
                  <th className="px-3 text-[13px] font-bold text-[#444]">Số điện thoại</th>
                  <th className="px-3 text-[13px] font-bold text-[#444]">Mã tour</th>
                  <th className="px-3 text-[13px] font-bold text-[#444]">Tổng tiền</th>
                  <th className="px-3 text-[13px] font-bold text-[#444]">Ngày thanh toán</th>
                  <th className="px-3 text-[13px] font-bold text-[#444]">Trạng thái</th>
                  <th className="px-3 text-[13px] font-bold text-[#444]">Ngân hàng</th>
                  <th className="px-3 text-[13px] font-bold text-[#444]">Mã giao dịch</th>
                  <th className="px-3 text-center text-[13px] font-bold text-[#444]">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPayments.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-[14px] text-[#6B7280]">
                      Không có dữ liệu thanh toán
                    </td>
                  </tr>
                ) : (
                  paginatedPayments.map((item) => (
                    <tr
                      key={item.id}
                      className="h-[56px] border-b border-[#F1F3F6] text-[14px] text-[#444] last:border-b-0 hover:bg-[#FAFBFC]"
                    >
                      <td className="truncate px-4">{item.fullName}</td>
                      <td className="truncate px-3">{item.email}</td>
                      <td className="truncate px-3">{item.phone}</td>
                      <td className="truncate px-3">{item.tourCode}</td>
                      <td className="truncate px-3">{formatMoney(item.amount)}</td>
                      <td className="truncate px-3">{formatDisplayDate(item.paymentDate)}</td>  {/* Ngày thanh toán */}
                      <td className="px-3">                                                       {/* Trạng thái */}
                        <button onClick={() => handleToggleStatus(item.id)} className="cursor-pointer">
                          <StatusBadge status={item.status} />
                        </button>
                      </td>
                      <td className="truncate px-3">{item.nganHang}</td>                         {/* Ngân hàng */}
                      <td className="truncate px-3">{item.maGiaoDich}</td>                       {/* Mã giao dịch */}
                      <td className="px-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setViewItem(item)}
                            className="flex h-[24px] w-[24px] items-center justify-center rounded-md border border-[#DFE5EC] bg-white text-[#7C8798] hover:bg-[#F8FAFC]"
                            title="Xem chi tiết"
                          >
                            <Eye className="h-[12px] w-[12px]" />
                          </button>
                          <button
                            onClick={() => openEditModal(item)}
                            className="flex h-[24px] w-[24px] items-center justify-center rounded-md border border-[#DFE5EC] bg-white text-[#7C8798] hover:bg-[#F8FAFC]"
                            title="Sửa"
                          >
                            <Pencil className="h-[12px] w-[12px]" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(item.id)}
                            className="flex h-[24px] w-[24px] items-center justify-center rounded-md border border-[#DFE5EC] bg-white text-[#7C8798] hover:bg-[#F8FAFC]"
                            title={item.status === "Đã thanh toán" ? "Khóa" : "Mở khóa"}
                          >
                            {item.status === "Đã thanh toán" ? (
                              <Lock className="h-[12px] w-[12px]" />
                            ) : (
                              <Unlock className="h-[12px] w-[12px]" />
                            )}
                          </button>
                          <button
                            onClick={() => setDeleteItem(item)}
                            className="flex h-[24px] w-[24px] items-center justify-center rounded-md border border-[#FFE2E2] bg-white text-[#FF5C5C] hover:bg-[#FFF5F5]"
                            title="Xóa"
                          >
                            <Trash2 className="h-[12px] w-[12px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-end px-6 py-4">
            <div className="flex items-center gap-2 rounded-[10px] border border-[#E5E7EB] bg-white px-3 py-1.5 text-[14px] font-semibold text-[#111827]">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2 disabled:opacity-50"
              >
                &lt;
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`min-w-[28px] ${currentPage === page ? "font-bold text-black" : "text-[#444]"}`}
                >
                  {page}
                </button>
              ))}
              {totalPages > 5 && <span>...</span>}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2 disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center gap-2 text-[14px] text-[#8B93A3]">
          <span>2026</span>
          <Bell className="h-[14px] w-[14px]" />
          <span>Duy Tan University</span>
        </div>
      </div>

      {/* View Modal */}
      {viewItem && (
        <ModalOverlay>
          <div className="max-h-[88vh] w-full max-w-[900px] overflow-y-auto rounded-[20px] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EEF1F5] px-6 py-4">
              <h2 className="text-[28px] font-bold text-[#111827]">Chi tiết thanh toán</h2>
              <button onClick={() => setViewItem(null)} className="rounded-full p-1 text-[#6B7280] hover:bg-[#F3F4F6]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-6 px-6 py-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <DetailBox label="Mã booking" value={viewItem.bookingId} />
                <DetailBox label="Họ tên" value={viewItem.fullName} />
                <DetailBox label="Email" value={viewItem.email} />
                <DetailBox label="Số điện thoại" value={viewItem.phone} />
                <DetailBox label="Tên tour" value={viewItem.tourName} />
                <DetailBox label="Mã tour" value={viewItem.tourCode} />
                <DetailBox label="Ngày khởi hành" value={formatDisplayDate(viewItem.ngaydi)} />
                <DetailBox label="Ngày kết thúc" value={formatDisplayDate(viewItem.ngayketthuc)} />
                <DetailBox label="Số lượng người lớn" value={String(viewItem.soLuongNguoiLon)} />
                <DetailBox label="Số lượng trẻ em" value={String(viewItem.soLuongTreEm)} />
                <DetailBox label="Tổng tiền" value={formatMoney(viewItem.amount) + " ₫"} />
                <DetailBox label="Ngày thanh toán" value={formatDisplayDate(viewItem.paymentDate)} />
                <DetailBox label="Trạng thái thanh toán" value={viewItem.status} />
                <DetailBox label="Ngân hàng" value={viewItem.nganHang} />
<DetailBox label="Mã giao dịch" value={viewItem.maGiaoDich} />
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-[#EEF1F5] px-6 py-4">
              <button
                onClick={() => setViewItem(null)}
                className="rounded-[8px] border border-[#D7DCE3] px-5 py-2 text-sm font-semibold text-[#374151]"
              >
                Đóng
              </button>
              <button
                onClick={() => { setViewItem(null); openEditModal(viewItem); }}
                className="rounded-[8px] bg-[#10B5F1] px-5 py-2 text-sm font-semibold text-white"
              >
                Chỉnh sửa
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* Delete Modal */}
      {deleteItem && (
        <ModalOverlay>
          <div className="w-full max-w-[420px] rounded-[18px] bg-white p-6 shadow-2xl">
            <h3 className="text-[24px] font-bold text-[#111827]">Xác nhận xóa</h3>
            <p className="mt-3 text-[15px] text-[#4B5563]">
              Bạn có chắc muốn xóa thanh toán của{" "}
              <span className="font-semibold text-[#111827]">{deleteItem.fullName}</span> không?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteItem(null)}
                className="rounded-[8px] border border-[#D7DCE3] px-5 py-2 text-sm font-semibold text-[#374151]"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="rounded-[8px] bg-[#FF4D4F] px-5 py-2 text-sm font-semibold text-white"
              >
                Xóa
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <ModalOverlay>
          <div className="w-full max-w-[980px] rounded-[12px] border border-[#BFC5CD] bg-[#F9F9F9] p-5 md:p-7">
            <h2 className="mb-5 text-[22px] font-bold text-black">Chỉnh sửa thanh toán</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <RoundedInput
                  placeholder="Họ tên"
                  value={form.fullName}
                  onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                />
                {formErrors.fullName && <ErrorText text={formErrors.fullName} />}
              </div>
              <div>
                <RoundedInput
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                />
                {formErrors.email && <ErrorText text={formErrors.email} />}
              </div>
              <div>
                <RoundedInput
                  placeholder="Số điện thoại"
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                />
                {formErrors.phone && <ErrorText text={formErrors.phone} />}
              </div>
              <div>
                <RoundedInput
                  placeholder="Mã tour"
                  value={form.tourCode}
                  onChange={(e) => setForm((prev) => ({ ...prev, tourCode: e.target.value }))}
                />
                {formErrors.tourCode && <ErrorText text={formErrors.tourCode} />}
              </div>
              <div>
                <RoundedInput
                  placeholder="Tổng tiền"
                  value={form.amount}
                  onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
                />
                {formErrors.amount && <ErrorText text={formErrors.amount} />}
              </div>
              <div>
                <DateInput
                  value={form.paymentDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, paymentDate: e.target.value }))}
                />
                {formErrors.paymentDate && <ErrorText text={formErrors.paymentDate} />}
              </div>
              <div className="md:col-span-2">
                <RoundedSelect
                  value={form.status}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as PaymentStatus }))}
                >
                  <option value="Chờ thanh toán">Chờ thanh toán</option>
                  <option value="Đã thanh toán">Đã thanh toán</option>
                </RoundedSelect>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={closeEditModal}
                className="rounded-[12px] border border-[#D7DCE3] bg-white px-6 py-3 text-[15px] font-semibold text-[#374151] hover:bg-[#F3F4F6]"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveEdit}
                className="rounded-[12px] bg-[#10B5F1] px-6 py-3 text-[15px] font-semibold text-white hover:bg-[#0da3d9]"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}