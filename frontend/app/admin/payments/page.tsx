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
} from "lucide-react";

type PaymentStatus = "Chờ thanh toán" | "Đã thanh toán";

type PaymentItem = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  tourCode: string;
  amount: number;
  paymentDate: string;
  status: PaymentStatus;
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

const initialPayments: PaymentItem[] = [
  {
    id: 1,
    fullName: "Phạm Văn B",
    email: "levana@gmail.com",
    phone: "01234567890",
    tourCode: "AB1247FG8H",
    amount: 573000,
    paymentDate: "2025-06-27",
    status: "Chờ thanh toán",
  },
  {
    id: 2,
    fullName: "Lê Văn A",
    email: "levana@gmail.com",
    phone: "01234567890",
    tourCode: "AB1247FG8H",
    amount: 1462165,
    paymentDate: "2025-06-27",
    status: "Đã thanh toán",
  },
  {
    id: 3,
    fullName: "Lê Văn A",
    email: "levana@gmail.com",
    phone: "01234567890",
    tourCode: "AB1247FG8H",
    amount: 3567809,
    paymentDate: "2025-06-27",
    status: "Đã thanh toán",
  },
  {
    id: 4,
    fullName: "Lê Văn A",
    email: "levana@gmail.com",
    phone: "01234567890",
    tourCode: "AB1247FG8H",
    amount: 987962,
    paymentDate: "2025-06-27",
    status: "Đã thanh toán",
  },
  {
    id: 5,
    fullName: "Nguyễn Văn D",
    email: "nguyenvand@gmail.com",
    phone: "09876543210",
    tourCode: "CD7845TRX",
    amount: 2150000,
    paymentDate: "2025-06-28",
    status: "Chờ thanh toán",
  },
  {
    id: 6,
    fullName: "Trần Thị M",
    email: "tranthi@gmail.com",
    phone: "0911222333",
    tourCode: "EF5621KLQ",
    amount: 4200000,
    paymentDate: "2025-06-29",
    status: "Đã thanh toán",
  },
];

const ITEMS_PER_PAGE = 4;

function formatMoney(value: number) {
  return value.toLocaleString("vi-VN");
}

function formatDisplayDate(date: string) {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return date;
  return `${day}/${month}/${year}`;
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
    <div
      className={`h-[116px] rounded-[10px] px-5 py-4 text-white ${className}`}
    >
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
      <div className="mt-1 text-[16px] font-medium text-[#111827]">
        {value || "-"}
      </div>
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

export default function Page() {
  const [payments, setPayments] = useState<PaymentItem[]>(initialPayments);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [viewItem, setViewItem] = useState<PaymentItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<PaymentItem | null>(null);
  const [editingItem, setEditingItem] = useState<PaymentItem | null>(null);
  const [form, setForm] = useState<PaymentForm>(createEmptyForm());
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const filteredPayments = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return payments.filter((item) => {
      const matchedKeyword =
        !keyword ||
        item.fullName.toLowerCase().includes(keyword) ||
        item.email.toLowerCase().includes(keyword) ||
        item.phone.toLowerCase().includes(keyword) ||
        item.tourCode.toLowerCase().includes(keyword) ||
        item.status.toLowerCase().includes(keyword) ||
        formatMoney(item.amount).includes(keyword) ||
        formatDisplayDate(item.paymentDate).toLowerCase().includes(keyword);

      const matchedDate = matchesDateRange(item.paymentDate, fromDate, toDate);

      return matchedKeyword && matchedDate;
    });
  }, [payments, searchTerm, fromDate, toDate]);

  const totalBookedTours = filteredPayments.length;
  const pendingCount = filteredPayments.filter(
    (item) => item.status === "Chờ thanh toán",
  ).length;
  const confirmedCount = filteredPayments.filter(
    (item) => item.status === "Đã thanh toán",
  ).length;
  const totalRevenue = filteredPayments
    .filter((item) => item.status === "Đã thanh toán")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPayments.length / ITEMS_PER_PAGE),
  );

  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPayments.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPayments, currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleToggleStatus = (id: number) => {
    setPayments((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status:
                item.status === "Đã thanh toán"
                  ? "Chờ thanh toán"
                  : "Đã thanh toán",
            }
          : item,
      ),
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
    if (!form.paymentDate.trim()) {
      errors.paymentDate = "Vui lòng chọn ngày thanh toán";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    if (!validateForm()) return;

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
          : item,
      ),
    );

    closeEditModal();
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, fromDate, toDate]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen w-full bg-[#F5F6F8] px-4 py-6 md:px-6 lg:px-8">
      <div className="w-full">
        <h1 className="mb-6 text-[36px] font-semibold tracking-tight text-[#111827]">
          Quản lý thanh toán
        </h1>

        <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard
            value={String(totalBookedTours)}
            label="Số lượng tour đã đặt"
            className="bg-[#5D75E7]"
          />
          <StatCard
            value={String(pendingCount)}
            label="Trạng thái chờ xác nhận"
            className="bg-[#EC8A57]"
          />
          <StatCard
            value={String(confirmedCount)}
            label="Trạng thái đã xác nhận"
            className="bg-[#7659E8]"
          />
          <StatCard
            value={formatMoney(totalRevenue)}
            label="Tổng doanh thu"
            className="bg-[#42C3A2]"
          />
        </div>

        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex w-full max-w-[390px] overflow-hidden rounded-[10px] border border-[#A8ADB7] bg-white">
            <div className="flex flex-1 items-center px-4">
              <Search className="mr-2 h-4 w-4 text-[#8B93A3]" />
              <input
                type="text"
                placeholder="Tìm kiếm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-[38px] w-full border-none bg-transparent text-[14px] text-[#111827] outline-none placeholder:text-[#A3A3A3]"
              />
            </div>
            <button
              onClick={handleSearch}
              className="flex h-[38px] min-w-[80px] items-center justify-center bg-[#13A8E3] px-5 text-[13px] font-semibold text-white hover:bg-[#0f9bd1]"
            >
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

        <div className="overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] table-fixed">
              <thead>
                <tr className="h-[52px] border-b border-[#EEF1F5] text-left">
                  <th className="px-4 text-[13px] font-bold text-[#444]">
                    Họ tên
                  </th>
                  <th className="px-3 text-[13px] font-bold text-[#444]">
                    Email
                  </th>
                  <th className="px-3 text-[13px] font-bold text-[#444]">
                    Số điện thoại
                  </th>
                  <th className="px-3 text-[13px] font-bold text-[#444]">
                    Mã tour
                  </th>
                  <th className="px-3 text-[13px] font-bold text-[#444]">
                    Tổng tiền
                  </th>
                  <th className="px-3 text-[13px] font-bold text-[#444]">
                    Ngày thanh toán
                  </th>
                  <th className="px-3 text-[13px] font-bold text-[#444]">
                    Trạng thái
                  </th>
                  <th className="px-3 text-center text-[13px] font-bold text-[#444]">
                    Hành động
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedPayments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-12 text-center text-[14px] text-[#6B7280]"
                    >
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
                      <td className="truncate px-3">
                        {formatMoney(item.amount)}
                      </td>
                      <td className="truncate px-3">
                        {formatDisplayDate(item.paymentDate)}
                      </td>
                      <td className="px-3">
                        <button
                          onClick={() => handleToggleStatus(item.id)}
                          className="cursor-pointer"
                        >
                          <StatusBadge status={item.status} />
                        </button>
                      </td>
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
                            title={
                              item.status === "Đã thanh toán"
                                ? "Khóa"
                                : "Mở khóa"
                            }
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

          <div className="flex justify-end px-6 py-4">
            <div className="flex items-center gap-2 rounded-[10px] border border-[#E5E7EB] bg-white px-3 py-1.5 text-[14px] font-semibold text-[#111827]">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`min-w-[18px] ${
                      currentPage === page ? "text-black" : "text-[#444]"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
              <span>...</span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center gap-2 text-[14px] text-[#8B93A3]">
          <span>2026</span>
          <Bell className="h-[14px] w-[14px]" />
          <span>Duy Tan University</span>
        </div>
      </div>

      {viewItem && (
        <ModalOverlay>
          <div className="max-h-[88vh] w-full max-w-[900px] overflow-y-auto rounded-[20px] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EEF1F5] px-6 py-4">
              <h2 className="text-[28px] font-bold text-[#111827]">
                Chi tiết thanh toán
              </h2>
              <button
                onClick={() => setViewItem(null)}
                className="rounded-full p-1 text-[#6B7280] hover:bg-[#F3F4F6]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 px-6 py-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <DetailBox label="Họ tên" value={viewItem.fullName} />
                <DetailBox label="Email" value={viewItem.email} />
                <DetailBox label="Số điện thoại" value={viewItem.phone} />
                <DetailBox label="Mã tour" value={viewItem.tourCode} />
                <DetailBox label="Tổng tiền" value={formatMoney(viewItem.amount)} />
                <DetailBox
                  label="Ngày thanh toán"
                  value={formatDisplayDate(viewItem.paymentDate)}
                />
                <DetailBox label="Trạng thái" value={viewItem.status} />
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
                onClick={() => {
                  setViewItem(null);
                  openEditModal(viewItem);
                }}
                className="rounded-[8px] bg-[#10B5F1] px-5 py-2 text-sm font-semibold text-black"
              >
                Chỉnh sửa
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {deleteItem && (
        <ModalOverlay>
          <div className="w-full max-w-[420px] rounded-[18px] bg-white p-6 shadow-2xl">
            <h3 className="text-[24px] font-bold text-[#111827]">
              Xác nhận xóa
            </h3>
            <p className="mt-3 text-[15px] text-[#4B5563]">
              Bạn có chắc muốn xóa thanh toán của{" "}
              <span className="font-semibold text-[#111827]">
                {deleteItem.fullName}
              </span>{" "}
              không?
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

      {editingItem && (
        <ModalOverlay>
          <div className="rounded-[12px] border border-[#BFC5CD] bg-[#F9F9F9] p-5 md:p-7 w-full max-w-[980px]">
            <div className="max-w-[980px]">
              <h2 className="mb-5 text-[22px] font-bold text-black">
                Chỉnh sửa thanh toán
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <RoundedInput
                    placeholder="Họ tên"
                    value={form.fullName}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, fullName: e.target.value }))
                    }
                  />
                  {formErrors.fullName && <ErrorText text={formErrors.fullName} />}
                </div>

                <div>
                  <RoundedInput
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                  {formErrors.email && <ErrorText text={formErrors.email} />}
                </div>

                <div>
                  <RoundedInput
                    placeholder="Số điện thoại"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, phone: e.target.value }))
                    }
                  />
                  {formErrors.phone && <ErrorText text={formErrors.phone} />}
                </div>

                <div>
                  <RoundedInput
                    placeholder="Mã tour"
                    value={form.tourCode}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, tourCode: e.target.value }))
                    }
                  />
                  {formErrors.tourCode && <ErrorText text={formErrors.tourCode} />}
                </div>

                <div>
                  <RoundedInput
                    placeholder="Tổng tiền"
                    value={form.amount}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, amount: e.target.value }))
                    }
                  />
                  {formErrors.amount && <ErrorText text={formErrors.amount} />}
                </div>

                <div>
                  <DateInput
                    value={form.paymentDate}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        paymentDate: e.target.value,
                      }))
                    }
                  />
                  {formErrors.paymentDate && (
                    <ErrorText text={formErrors.paymentDate} />
                  )}
                </div>

                <div className="md:col-span-2">
                  <RoundedSelect
                    value={form.status}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        status: e.target.value as PaymentStatus,
                      }))
                    }
                  >
                    <option value="Chờ thanh toán">Chờ thanh toán</option>
                    <option value="Đã thanh toán">Đã thanh toán</option>
                  </RoundedSelect>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={closeEditModal}
                  className="min-w-[96px] rounded-[6px] border border-[#AEB4BC] bg-white px-6 py-2.5 text-[16px] font-bold text-[#222]"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="min-w-[110px] rounded-[6px] bg-[#10B5F1] px-6 py-2.5 text-[16px] font-bold text-black"
                >
                  Lưu thanh toán
                </button>
              </div>
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}