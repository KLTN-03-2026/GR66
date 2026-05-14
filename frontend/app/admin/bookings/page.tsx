"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useViewBooking } from "@/hooks/useBooking";
import type { BookedTour } from "@/types/booking";

type BookingStatus = | "Đã hủy" | "Chưa xác nhận" | "Đã xác nhận" | "Đang diễn ra" | "Hoàn thành tour";

type BookingItem = {
  id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  bookingCode: string;
  createdAt: string;
  tourName: string;
  createdDate: string;
  endDate: string;
  peopleCount: number;
  price: number;
  extraServices: string;
  status: BookingStatus;
};

const ITEMS_PER_PAGE = 4;
const statusOrder: BookingStatus[] = ["Chưa xác nhận", "Đã xác nhận", "Đang diễn ra", "Hoàn thành tour", "Đã hủy",];


function formatPrice(value: number) {
  return value.toLocaleString("vi-VN");
}


// mapAPI
function mapApiToBookingItem(item: any): BookingItem {
  return {
    id: item._id ?? "",
    bookingCode: item._id ?? "",
    createdAt: item.createdAt ?? "",
    tourName: item.tourId?.tenTour ?? item.tourId?.name ?? "—",
    createdDate: item.ngaydat
      ? new Date(item.ngaydat).toLocaleDateString("vi-VN")
      : "",
    endDate: item.ngayketthuc
      ? new Date(item.ngayketthuc).toLocaleDateString("vi-VN")
      : item.scheduleId?.ngayketthuc
        ? new Date(item.scheduleId.ngayketthuc).toLocaleDateString("vi-VN")
        : "",
    peopleCount: (item.soluongnguoilon ?? 0) + (item.soluongtreem ?? 0),
    price: item.tongtien ?? 0,
    extraServices: Array.isArray(item.bookingDetails)
      ? item.bookingDetails
        .map((d: any) => d?.tourServiceId?.dichvuId?.tendichvu)
        .filter(Boolean)
        .join(", ")
      : "",
    // ← chỉ cần map thẳng, BE đã trả đúng enum
    status: (
      [
        "Chưa xác nhận",
        "Đã xác nhận",
        "Đang diễn ra",
        "Hoàn thành tour",
        "Đã hủy",
      ] as BookingStatus[]
    ).includes(item.trangthai)
      ? (item.trangthai as BookingStatus)
      : "Chưa xác nhận", // fallback nếu BE trả về giá trị lạ
    userName: item.userId?.hoten ?? "—",
    userEmail: item.userId?.email ?? "—",
    userPhone: item.userId?.sdt ?? "—",
  };
}

export default function BookingsPage() {
  const { bookings: apiBookings, loading, error } = useViewBooking();
  console.log("apiBookings:", apiBookings);
  console.log("loading:", loading);
  console.log("error:", error);

  // Local state để cho phép edit/delete/toggle mà không cần mutate API
  const [localBookings, setLocalBookings] = useState<BookingItem[]>([]);

  useEffect(() => {
    if (apiBookings && apiBookings.length > 0) {
      setLocalBookings(
        (apiBookings as any[])
          .filter((item) => item != null && item._id)
          .map(mapApiToBookingItem)
      );
    }
  }, [apiBookings]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editingBooking, setEditingBooking] = useState<BookingItem | null>(null);
  const [viewingBooking, setViewingBooking] = useState<BookingItem | null>(null);

  const [editForm, setEditForm] = useState({
    bookingCode: "",
    tourName: "",
    createdDate: "",
    endDate: "",
    peopleCount: "",
    price: "",
    extraServices: "",
    status: "Chưa xác nhận" as BookingStatus,
  });

  const menuRef = useRef<HTMLDivElement | null>(null);

  const filteredBookings = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return [...localBookings]
      .filter((booking) =>
        booking.bookingCode.toLowerCase().includes(keyword) ||
        booking.tourName.toLowerCase().includes(keyword) ||
        booking.createdDate.toLowerCase().includes(keyword) ||
        booking.endDate.toLowerCase().includes(keyword) ||
        booking.extraServices.toLowerCase().includes(keyword) ||
        booking.status.toLowerCase().includes(keyword) ||
        String(booking.peopleCount).includes(keyword) ||
        formatPrice(booking.price).includes(keyword)
      )                                                         // ← sau đây
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });                                                       // ← trước đây
  }, [localBookings, searchTerm]);
  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / ITEMS_PER_PAGE));
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBookings.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredBookings, currentPage]);



  const handleDeleteBooking = (id: string) => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa booking này không?");
    if (!confirmed) return;
    setLocalBookings((prev) => prev.filter((item) => item.id !== id));
    setMenuOpenId(null);
  };

  const handleOpenEdit = (booking: BookingItem) => {
    setEditingBooking(booking);
    setEditForm({
      bookingCode: booking.bookingCode,
      tourName: booking.tourName,
      createdDate: booking.createdDate,
      endDate: booking.endDate,
      peopleCount: String(booking.peopleCount),
      price: String(booking.price),
      extraServices: booking.extraServices,
      status: booking.status,
    });
    setMenuOpenId(null);
  };

  const handleSaveEdit = () => {
    if (!editingBooking) return;
    setLocalBookings((prev) =>
      prev.map((item) =>
        item.id === editingBooking.id
          ? {
            ...item,
            bookingCode: editForm.bookingCode,
            tourName: editForm.tourName,
            createdDate: editForm.createdDate,
            endDate: editForm.endDate,
            peopleCount: Number(editForm.peopleCount) || 0,
            price: Number(editForm.price) || 0,
            extraServices: editForm.extraServices,
            status: editForm.status,
          }
          : item
      )
    );
    setEditingBooking(null);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpenId(null);
      }
    };
    if (menuOpenId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpenId]);

  if (loading) {
    return <div className="p-10 text-center">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }



  return (
    <>
      <div className="min-h-screen w-full bg-[#F5F6F8] px-6 py-6 md:px-8 lg:px-10">
        <div className="w-full">
          <h1 className="mb-7 text-[36px] md:text-[42px] font-semibold tracking-tight text-gray-900">
            Quản lý đặt tour
          </h1>

          <div className="mb-9 flex justify-end">
            <div className="flex w-full max-w-[430px] overflow-hidden rounded-[10px] border border-[#BFC7D4] bg-white">
              <div className="flex flex-1 items-center px-4">
                <Search className="mr-2 h-4 w-4 text-[#80899A]" />
                <input
                  type="text"
                  placeholder="Tìm kiếm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-[42px] w-full border-none bg-transparent text-[14px] text-[#2C3543] outline-none placeholder:text-[#9CA3AF]"
                />
              </div>
              <button className="flex h-[42px] min-w-[72px] items-center justify-center bg-[#15A5D8] px-5 text-[14px] font-semibold text-white transition hover:bg-[#1298c7]">
                Tìm
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white">
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[1180px] table-fixed">
                <thead>
                  <tr className="h-[46px] border-b border-[#EDF0F4] bg-white text-left">
                    <th className="w-[130px] px-3 text-[14px] font-bold text-[#404756]">Khách hàng</th>
                    <th className="w-[105px] px-5 text-[14px] font-bold text-[#404756]">Mã đặt tour</th>
                    <th className="w-[90px] px-3 text-[14px] font-bold text-[#404756]">Tên tour</th>
                    <th className="w-[95px] px-3 text-[14px] font-bold text-[#404756]">Ngày khởi tạo</th>
                    <th className="w-[95px] px-3 text-[14px] font-bold text-[#404756]">Ngày kết thúc</th>
                    <th className="w-[90px] px-3 text-[14px] font-bold text-[#404756]">Số người</th>
                    <th className="w-[100px] px-3 text-[14px] font-bold text-[#404756]">Giá</th>
                    <th className="w-[120px] px-3 text-[14px] font-bold text-[#404756]">Dịch vụ thêm</th>
                    <th className="w-[110px] px-3 text-[14px] font-bold text-[#404756]">Trạng thái</th>
                    <th className="w-[120px] px-4 text-center text-[14px] font-bold text-[#404756]">Hành động</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedBookings.length === 0 ? (
                    <tr>
                      <td
                        colSpan={10}
                        className="py-12 text-center text-[14px] text-[#6B7280]"
                      >
                        Không tìm thấy booking nào
                      </td>
                    </tr>
                  ) : (
                    paginatedBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="h-[46px] border-b border-[#F1F3F6] text-[14px] text-[#424A57] last:border-b-0"
                      >
                        {/* Khách hàng */}
                        <td className="px-3">
                          <div className="flex flex-col gap-0.5">
                            <span className="truncate font-medium text-[#1F2937]">
                              {booking.userName}
                            </span>

                            <span className="truncate text-[12px] text-[#6B7280]">
                              {booking.userPhone}
                            </span>
                          </div>
                        </td>

                        {/* Mã đặt tour */}
                        <td className="truncate px-5">
                          {booking.bookingCode}
                        </td>

                        {/* Tên tour */}
                        <td className="truncate px-3">
                          {booking.tourName}
                        </td>

                        {/* Ngày khởi tạo */}
                        <td className="truncate px-3">
                          {booking.createdDate}
                        </td>

                        {/* Ngày kết thúc */}
                        <td className="truncate px-3">
                          {booking.endDate}
                        </td>

                        {/* Số người */}
                        <td className="truncate px-3">
                          {booking.peopleCount} người
                        </td>

                        {/* Giá */}
                        <td className="truncate px-3">
                          {formatPrice(booking.price)}
                        </td>

                        {/* Dịch vụ thêm */}
                        <td className="truncate px-3">
                          {booking.extraServices
                            ? `${booking.extraServices
                              .split(",")
                              .filter((s) => s.trim()).length
                            } dịch vụ`
                            : "-"}
                        </td>

                        {/* Trạng thái */}
                        <td className="px-3">
                          <span className={getStatusClassName(booking.status)}>
                            {booking.status}
                          </span>
                        </td>

                        {/* Hành động */}
                        <td className="px-4">
                          <div className="flex items-center justify-center gap-2">
                            <div
                              className="relative"
                              ref={menuOpenId === booking.id ? menuRef : null}
                            >
                              <button
                                onClick={() =>
                                  setMenuOpenId((prev) =>
                                    prev === booking.id ? null : booking.id
                                  )
                                }
                                className="flex h-[28px] w-[28px] items-center justify-center rounded-md bg-[#F7F8FA] text-[#4B5563] transition hover:bg-[#ECEFF3]"
                              >
                                <MoreHorizontal className="h-[16px] w-[16px]" />
                              </button>

                              {menuOpenId === booking.id && (
                                <div className="absolute right-0 top-9 z-20 w-[180px] rounded-xl border border-[#E5E7EB] bg-white p-2 shadow-lg">
                                  <button
                                    onClick={() => {
                                      setViewingBooking(booking);
                                      setMenuOpenId(null);
                                    }}
                                    className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-[#374151] transition hover:bg-[#F7F9FC]"
                                  >
                                    Xem chi tiết
                                  </button>

                                  <button
                                    onClick={() => handleOpenEdit(booking)}
                                    className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-[#374151] transition hover:bg-[#F7F9FC]"
                                  >
                                    Chỉnh sửa
                                  </button>

                                  <button
                                    onClick={() => handleDeleteBooking(booking.id)}
                                    className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-[#EF4444] transition hover:bg-[#FFF5F5]"
                                  >
                                    Xóa booking
                                  </button>
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => handleOpenEdit(booking)}
                              className="flex h-[28px] w-[28px] items-center justify-center rounded-md border border-[#E2E8F0] bg-white text-[#6B7280] transition hover:bg-[#F8FAFC]"
                              title="Sửa"
                            >
                              <Pencil className="h-[14px] w-[14px]" />
                            </button>

                            <button
                              onClick={() => handleDeleteBooking(booking.id)}
                              className="flex h-[28px] w-[28px] items-center justify-center rounded-md border border-[#FFE1E1] bg-white text-[#FF5C5C] transition hover:bg-[#FFF5F5]"
                              title="Xóa"
                            >
                              <Trash2 className="h-[14px] w-[14px]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="flex h-8 w-8 items-center justify-center rounded-md text-[#111827] transition hover:bg-[#F3F4F6] disabled:cursor-not-allowed disabled:opacity-40"
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`min-w-[24px] text-[16px] font-semibold ${currentPage === page
                    ? "text-[#111827]"
                    : "text-[#111827] opacity-80 hover:opacity-100"
                    }`}
                >
                  {page}
                </button>
              ))}

              <span className="px-1 text-[18px] font-semibold text-[#111827]">..</span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="flex h-8 w-8 items-center justify-center rounded-md text-[#111827] transition hover:bg-[#F3F4F6] disabled:cursor-not-allowed disabled:opacity-40"
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {editingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[640px] rounded-[24px] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EEF1F5] px-6 py-4">
              <h2 className="text-[28px] font-semibold text-[#1F2937]">Sửa đặt tour</h2>
              <button
                onClick={() => setEditingBooking(null)}
                className="rounded-full p-1 text-[#6B7280] transition hover:bg-[#F3F4F6]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 px-6 py-5 md:grid-cols-2">
              <Field label="Mã đặt tour">
                <input
                  value={editForm.bookingCode}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, bookingCode: e.target.value }))}
                  className="h-[46px] w-full rounded-xl border border-[#D8DEE8] px-4 text-gray-900 outline-none focus:border-[#15A5D8]"
                />
              </Field>

              <Field label="Tên tour">
                <input
                  value={editForm.tourName}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, tourName: e.target.value }))}
                  className="h-[46px] w-full rounded-xl border border-[#D8DEE8] px-4 text-gray-900 outline-none focus:border-[#15A5D8]"
                />
              </Field>

              <Field label="Ngày khởi tạo">
                <input
                  value={editForm.createdDate}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, createdDate: e.target.value }))}
                  className="h-[46px] w-full rounded-xl border border-[#D8DEE8] px-4 text-gray-900 outline-none focus:border-[#15A5D8]"
                />
              </Field>

              <Field label="Ngày kết thúc">
                <input
                  value={editForm.endDate}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, endDate: e.target.value }))}
                  className="h-[46px] w-full rounded-xl border border-[#D8DEE8] px-4 text-gray-900 outline-none focus:border-[#15A5D8]"
                />
              </Field>

              <Field label="Số người">
                <input
                  value={editForm.peopleCount}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, peopleCount: e.target.value }))}
                  className="h-[46px] w-full rounded-xl border border-[#D8DEE8] px-4 text-gray-900 outline-none focus:border-[#15A5D8]"
                />
              </Field>

              <Field label="Giá">
                <input
                  value={editForm.price}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, price: e.target.value }))}
                  className="h-[46px] w-full rounded-xl border border-[#D8DEE8] px-4 text-gray-900 outline-none focus:border-[#15A5D8]"
                />
              </Field>

              <div className="md:col-span-2">
                <Field label="Dịch vụ thêm">
                  <input
                    value={editForm.extraServices}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, extraServices: e.target.value }))}
                    className="h-[46px] w-full rounded-xl border border-[#D8DEE8] px-4 text-gray-900 outline-none focus:border-[#15A5D8]"
                  />
                </Field>
              </div>

              <div className="md:col-span-2">
                <Field label="Trạng thái">
                  <select
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, status: e.target.value as BookingStatus }))
                    }
                    className="h-[46px] w-full rounded-xl border border-[#D8DEE8] bg-white px-4 text-gray-900 outline-none focus:border-[#15A5D8]"
                  >
                    <option value="Chưa xác nhận">Chưa xác nhận</option>
                    <option value="Đã xác nhận">Đã xác nhận</option>
                    <option value="Đang diễn ra">Đang diễn ra</option>
                    <option value="Hoàn thành tour">Hoàn thành tour</option>
                    <option value="Đã hủy">Đã hủy</option>
                  </select>
                </Field>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-[#EEF1F5] px-6 py-4">
              <button
                onClick={() => setEditingBooking(null)}
                className="rounded-xl border border-[#D8DEE8] px-5 py-2.5 text-sm font-semibold text-[#4B5563] transition hover:bg-[#F9FAFB]"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveEdit}
                className="rounded-xl bg-[#15A5D8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1196c4]"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[560px] rounded-[24px] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EEF1F5] px-6 py-4">
              <h2 className="text-[26px] font-semibold text-[#1F2937]">Chi tiết đặt tour</h2>
              <button
                onClick={() => setViewingBooking(null)}
                className="rounded-full p-1 text-[#6B7280] transition hover:bg-[#F3F4F6]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5 text-[15px] text-[#374151]">
              <DetailRow label="Khách hàng" value={viewingBooking.userName} />
              <DetailRow label="Email" value={viewingBooking.userEmail} />
              <DetailRow label="Số điện thoại" value={viewingBooking.userPhone} />
              <DetailRow label="Mã đặt tour" value={viewingBooking.bookingCode} />
              <DetailRow label="Tên tour" value={viewingBooking.tourName} />
              <DetailRow label="Ngày khởi tạo" value={viewingBooking.createdDate} />
              <DetailRow label="Ngày kết thúc" value={viewingBooking.endDate} />
              <DetailRow label="Số người" value={`${viewingBooking.peopleCount} người`} />
              <DetailRow label="Giá" value={formatPrice(viewingBooking.price)} />
              <DetailRow label="Dịch vụ thêm" value={viewingBooking.extraServices || "-"} />
              <div className="flex items-start justify-between gap-4 border-b border-[#F1F5F9] pb-3 last:border-b-0">
                <span className="font-semibold text-[#111827]">Trạng thái</span>
                <span className={getStatusClassName(viewingBooking.status)}>
                  {viewingBooking.status}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-[#EEF1F5] px-6 py-4">
              <button
                onClick={() => {
                  setEditingBooking(viewingBooking);
                  setEditForm({
                    bookingCode: viewingBooking.bookingCode,
                    tourName: viewingBooking.tourName,
                    createdDate: viewingBooking.createdDate,
                    endDate: viewingBooking.endDate,
                    peopleCount: String(viewingBooking.peopleCount),
                    price: String(viewingBooking.price),
                    extraServices: viewingBooking.extraServices,
                    status: viewingBooking.status,
                  });
                  setViewingBooking(null);
                }}
                className="rounded-xl bg-[#15A5D8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1196c4]"
              >
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">{label}</label>
      {children}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#F1F5F9] pb-3 last:border-b-0">
      <span className="font-semibold text-[#111827]">{label}</span>
      <span className="text-right text-[#4B5563]">{value}</span>
    </div>
  );
}

function getStatusClassName(status: BookingStatus) {
  switch (status) {
    case "Đã hủy":
      return "inline-flex min-w-[90px] items-center justify-center rounded-md bg-[#FEE2E2] px-3 py-[3px] text-[12px] font-semibold text-[#DC2626]";

    case "Chưa xác nhận":
      return "inline-flex min-w-[120px] items-center justify-center rounded-md bg-[#FEF3C7] px-3 py-[3px] text-[12px] font-semibold text-[#D97706]";

    case "Đã xác nhận":
      return "inline-flex min-w-[110px] items-center justify-center rounded-md bg-[#DBEAFE] px-3 py-[3px] text-[12px] font-semibold text-[#2563EB]";

    case "Đang diễn ra":
      return "inline-flex min-w-[120px] items-center justify-center rounded-md bg-[#DCFCE7] px-3 py-[3px] text-[12px] font-semibold text-[#16A34A]";

    case "Hoàn thành tour":
      return "inline-flex min-w-[130px] items-center justify-center rounded-md bg-[#EDE9FE] px-3 py-[3px] text-[12px] font-semibold text-[#7C3AED]";

    default:
      return "";
  }
}