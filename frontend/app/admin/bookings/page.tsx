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

type BookingStatus = "Đã hủy" | "Chưa xác nhận" | "Xác nhận";

type BookingItem = {
  id: number;
  bookingCode: string;
  tourName: string;
  createdDate: string;
  endDate: string;
  peopleCount: number;
  price: number;
  extraServices: string;
  status: BookingStatus;
};

const initialBookings: BookingItem[] = [
  {
    id: 1,
    bookingCode: "AB1247FG8H",
    tourName: "Đà Nẵng",
    createdDate: "27/6/2025",
    endDate: "27/6/2025",
    peopleCount: 12,
    price: 50000000,
    extraServices: "nơi ở, pt di chuyển",
    status: "Đã hủy",
  },
  {
    id: 2,
    bookingCode: "AB1247FG8H",
    tourName: "Hội An",
    createdDate: "27/6/2025",
    endDate: "27/6/2025",
    peopleCount: 6,
    price: 20000000,
    extraServices: "nơi ở",
    status: "Chưa xác nhận",
  },
  {
    id: 3,
    bookingCode: "AB1247FG8H",
    tourName: "Huế",
    createdDate: "27/6/2025",
    endDate: "27/6/2025",
    peopleCount: 5,
    price: 10000000,
    extraServices: "pt di chuyển",
    status: "Xác nhận",
  },
  {
    id: 4,
    bookingCode: "AB1247FG8H",
    tourName: "Hòa Vang",
    createdDate: "27/6/2025",
    endDate: "27/6/2025",
    peopleCount: 7,
    price: 15000000,
    extraServices: "",
    status: "Xác nhận",
  },
  {
    id: 5,
    bookingCode: "CD8891KK2",
    tourName: "Bà Nà Hills",
    createdDate: "28/6/2025",
    endDate: "29/6/2025",
    peopleCount: 4,
    price: 12000000,
    extraServices: "nơi ở, ăn uống",
    status: "Chưa xác nhận",
  },
  {
    id: 6,
    bookingCode: "EF5566MN9",
    tourName: "Cù Lao Chàm",
    createdDate: "29/6/2025",
    endDate: "30/6/2025",
    peopleCount: 10,
    price: 24000000,
    extraServices: "cano, nơi ở",
    status: "Xác nhận",
  },
  {
    id: 7,
    bookingCode: "GH3388ZX1",
    tourName: "Mỹ Sơn",
    createdDate: "30/6/2025",
    endDate: "30/6/2025",
    peopleCount: 8,
    price: 16000000,
    extraServices: "xe đưa đón",
    status: "Đã hủy",
  },
  {
    id: 8,
    bookingCode: "JK1022PT7",
    tourName: "Lăng Cô",
    createdDate: "01/7/2025",
    endDate: "02/7/2025",
    peopleCount: 9,
    price: 30000000,
    extraServices: "nơi ở, pt di chuyển",
    status: "Xác nhận",
  },
];

const ITEMS_PER_PAGE = 4;

const statusOrder: BookingStatus[] = ["Đã hủy", "Chưa xác nhận", "Xác nhận"];

function formatPrice(value: number) {
  return value.toLocaleString("vi-VN");
}

function getNextStatus(status: BookingStatus): BookingStatus {
  const currentIndex = statusOrder.indexOf(status);
  return statusOrder[(currentIndex + 1) % statusOrder.length];
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>(initialBookings);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
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

    return bookings.filter((booking) => {
      return (
        booking.bookingCode.toLowerCase().includes(keyword) ||
        booking.tourName.toLowerCase().includes(keyword) ||
        booking.createdDate.toLowerCase().includes(keyword) ||
        booking.endDate.toLowerCase().includes(keyword) ||
        booking.extraServices.toLowerCase().includes(keyword) ||
        booking.status.toLowerCase().includes(keyword) ||
        String(booking.peopleCount).includes(keyword) ||
        formatPrice(booking.price).includes(keyword)
      );
    });
  }, [bookings, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / ITEMS_PER_PAGE));

  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBookings.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredBookings, currentPage]);

  const handleDeleteBooking = (id: number) => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa booking này không?");
    if (!confirmed) return;

    setBookings((prev) => prev.filter((item) => item.id !== id));
    setMenuOpenId(null);
  };

  const handleQuickToggleStatus = (id: number) => {
    setBookings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: getNextStatus(item.status) } : item
      )
    );
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

    setBookings((prev) =>
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
                    <th className="w-[105px] px-5 text-[14px] font-bold text-[#404756]">
                      Mã đặt tour
                    </th>
                    <th className="w-[90px] px-3 text-[14px] font-bold text-[#404756]">
                      Tên tour
                    </th>
                    <th className="w-[95px] px-3 text-[14px] font-bold text-[#404756]">
                      Ngày khởi tạo
                    </th>
                    <th className="w-[95px] px-3 text-[14px] font-bold text-[#404756]">
                      Ngày kết thúc
                    </th>
                    <th className="w-[90px] px-3 text-[14px] font-bold text-[#404756]">
                      Số người
                    </th>
                    <th className="w-[100px] px-3 text-[14px] font-bold text-[#404756]">
                      Giá
                    </th>
                    <th className="w-[120px] px-3 text-[14px] font-bold text-[#404756]">
                      Dịch vụ thêm
                    </th>
                    <th className="w-[110px] px-3 text-[14px] font-bold text-[#404756]">
                      Trạng thái
                    </th>
                    <th className="w-[120px] px-4 text-center text-[14px] font-bold text-[#404756]">
                      Hành động
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedBookings.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
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
                        <td className="truncate px-5">{booking.bookingCode}</td>
                        <td className="truncate px-3">{booking.tourName}</td>
                        <td className="truncate px-3">{booking.createdDate}</td>
                        <td className="truncate px-3">{booking.endDate}</td>
                        <td className="truncate px-3">{booking.peopleCount} người</td>
                        <td className="truncate px-3">{formatPrice(booking.price)}</td>
                        <td className="truncate px-3">
                          {booking.extraServices || "-"}
                        </td>
                        <td className="px-3">
                          <button
                            onClick={() => handleQuickToggleStatus(booking.id)}
                            className={getStatusClassName(booking.status)}
                            title="Bấm để đổi trạng thái"
                          >
                            {booking.status}
                          </button>
                        </td>
                        <td className="px-4">
                          <div className="flex items-center justify-center gap-2">
                            <div className="relative" ref={menuOpenId === booking.id ? menuRef : null}>
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
                                    onClick={() => handleQuickToggleStatus(booking.id)}
                                    className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-[#374151] transition hover:bg-[#F7F9FC]"
                                  >
                                    Đổi trạng thái
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
                  className={`min-w-[24px] text-[16px] font-semibold ${
                    currentPage === page
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
              <h2 className="text-[28px] font-semibold text-[#1F2937]">
                Sửa đặt tour
              </h2>
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
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, bookingCode: e.target.value }))
                  }
                  className="h-[46px] w-full rounded-xl border border-[#D8DEE8] px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#15A5D8]"
                />
              </Field>

              <Field label="Tên tour">
                <input
                  value={editForm.tourName}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, tourName: e.target.value }))
                  }
                  className="h-[46px] w-full rounded-xl border border-[#D8DEE8] px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#15A5D8]"
                />
              </Field>

              <Field label="Ngày khởi tạo">
                <input
                  value={editForm.createdDate}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, createdDate: e.target.value }))
                  }
                  className="h-[46px] w-full rounded-xl border border-[#D8DEE8] px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#15A5D8]"
                />
              </Field>

              <Field label="Ngày kết thúc">
                <input
                  value={editForm.endDate}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                  className="h-[46px] w-full rounded-xl border border-[#D8DEE8] px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#15A5D8]"
                />
              </Field>

              <Field label="Số người">
                <input
                  value={editForm.peopleCount}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, peopleCount: e.target.value }))
                  }
                  className="h-[46px] w-full rounded-xl border border-[#D8DEE8] px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#15A5D8]"
                />
              </Field>

              <Field label="Giá">
                <input
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, price: e.target.value }))
                  }
                  className="h-[46px] w-full rounded-xl border border-[#D8DEE8] px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#15A5D8]"
                />
              </Field>

              <div className="md:col-span-2">
                <Field label="Dịch vụ thêm">
                  <input
                    value={editForm.extraServices}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        extraServices: e.target.value,
                      }))
                    }
                    className="h-[46px] w-full rounded-xl border border-[#D8DEE8] px-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#15A5D8]"
                  />
                </Field>
              </div>

              <div className="md:col-span-2">
                <Field label="Trạng thái">
                  <select
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        status: e.target.value as BookingStatus,
                      }))
                    }
                    className="h-[46px] w-full rounded-xl border border-[#D8DEE8] bg-white px-4 text-gray-900 outline-none focus:border-[#15A5D8]"
                  >
                    <option value="Đã hủy">Đã hủy</option>
                    <option value="Chưa xác nhận">Chưa xác nhận</option>
                    <option value="Xác nhận">Xác nhận</option>
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
              <h2 className="text-[26px] font-semibold text-[#1F2937]">
                Chi tiết đặt tour
              </h2>
              <button
                onClick={() => setViewingBooking(null)}
                className="rounded-full p-1 text-[#6B7280] transition hover:bg-[#F3F4F6]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5 text-[15px] text-[#374151]">
              <DetailRow label="Mã đặt tour" value={viewingBooking.bookingCode} />
              <DetailRow label="Tên tour" value={viewingBooking.tourName} />
              <DetailRow label="Ngày khởi tạo" value={viewingBooking.createdDate} />
              <DetailRow label="Ngày kết thúc" value={viewingBooking.endDate} />
              <DetailRow label="Số người" value={`${viewingBooking.peopleCount} người`} />
              <DetailRow label="Giá" value={formatPrice(viewingBooking.price)} />
              <DetailRow
                label="Dịch vụ thêm"
                value={viewingBooking.extraServices || "-"}
              />
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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
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
  if (status === "Đã hủy") {
    return "inline-flex min-w-[76px] items-center justify-center rounded-md bg-[#F9D9D6] px-3 py-[3px] text-[12px] font-semibold text-[#FF4D3D]";
  }

  if (status === "Chưa xác nhận") {
    return "inline-flex min-w-[108px] items-center justify-center rounded-md bg-[#E8E9B9] px-3 py-[3px] text-[12px] font-semibold text-[#C4C400]";
  }

  return "inline-flex min-w-[76px] items-center justify-center rounded-md bg-[#CDEEE7] px-3 py-[3px] text-[12px] font-semibold text-[#00C7A5]";
}