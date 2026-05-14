"use client";

import React, { useEffect, useState } from "react";
import { Star, X, Calendar, Users, MapPin, AlertCircle } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { jwtDecode } from "jwt-decode";
import { viewBooking } from "@/services/bookingService";
import { InvoiceItem } from "@/types/booking"


function formatMoney(value?: number) {
  if (!value && value !== 0) return "0 ₫";
  return `${value.toLocaleString("vi-VN")} ₫`;
}

function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1
  ).padStart(2, "0")}/${d.getFullYear()}`;
}

function formatDateTime(dateStr: string | undefined | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1
  ).padStart(2, "0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function InvoiceReviewPage() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailInvoice, setDetailInvoice] = useState<InvoiceItem | null>(null);
  const [reviewingInvoice, setReviewingInvoice] = useState<InvoiceItem | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  //Nếu hiện đã thanh toán thì thì mới hiện
  const paidInvoices = invoices.filter((invoice) => invoice.paymentStatus === "Đã thanh toán");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserId(decoded.userId || decoded.id || decoded.sub);
        if (userData) {
          const user = JSON.parse(userData);
          setUserInfo(user);
        }
      } catch (err) {
        console.error("Lỗi decode token:", err);
      }
    }
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!userInfo && !userId) return;

      try {
        setLoading(true);
        setError(null);

        const bookings = await viewBooking();
        if (!bookings || !Array.isArray(bookings)) {
          setInvoices([]);
          setLoading(false);
          return;
        }

        // chỉ lấy booking của user hiện tại
        const userBookings = bookings.filter((booking: any) => {
          const bookingUserId =
            typeof booking.userId === "object"
              ? booking.userId?._id
              : booking.userId;

          return bookingUserId === userId;
});


       const mappedInvoices: InvoiceItem[] = userBookings.map((booking: any, index: number) => {
          const tourDetails = typeof booking.tourId === "object" ? booking.tourId : {};
          const schedule = typeof booking.scheduleId === "object" ? booking.scheduleId : {};
          return {
            id: index + 1,
            bookingId: booking._id || `BOOKING-${index + 1}`,
            tourId: tourDetails._id || "",
            tourName: tourDetails.tenTour || "Không có tên tour",
            location: tourDetails.diaDiem || "Đang cập nhật",
            image:
              Array.isArray(tourDetails.hinhAnh) && tourDetails.hinhAnh.length > 0
                ? tourDetails.hinhAnh[0]
                : typeof tourDetails.hinhAnh === "string"
                  ? tourDetails.hinhAnh
                  : "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb",
            bookingDate: formatDateTime(booking.ngaydat || booking.createdAt),
            paymentStatus: booking.trangThaiThanhToan || "Chưa thanh toán",
            total: booking.tongtien || 0,
            customerName: userInfo?.hoten || userInfo?.name || "—",
            customerPhone: userInfo?.sdt || userInfo?.phone || "—",
            customerEmail: userInfo?.email || "—",
            customerCode: userId || userInfo?._id || "—",
            adults: booking.soluongnguoilon || 0,
            children: booking.soluongtreem || 0,
            departureDate: formatDate(booking.ngaydi || (schedule?.ngaykhoihanh ?? null)),
            endDate: formatDate(schedule?.ngayketthuc ?? null),
            tourAdultPrice: booking.gianguoilonhientai || 0,
            tourChildPrice: booking.giatreemhientai || 0,
            services: Array.isArray(booking.bookingDetails)
              ? booking.bookingDetails.map((detail: any) => ({
                  tenDichVu:
                    detail.tourServiceId?.tenDichVuApDung ||
                    detail.tourServiceId?.dichvuId?.tenDichVu ||
                    "Dịch vụ",
                  giaNguoiLon: detail.dongianguoilonhientai || 0,
                  giaTreEm: detail.dongiatreemhientai || 0,
                }))
              : [],
            trangthai: booking.trangthai || "Đang xử lý",
          };
        });
        

        setInvoices(mappedInvoices);
      } catch (err: any) {
        console.error("Lỗi fetch bookings:", err);
        setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userInfo, userId]);

  const handleSubmitReview = async () => {
    try {
      if (!reviewingInvoice) return;

      const token = localStorage.getItem("accessToken");
      if (!token || !userId) {
        alert("Chưa đăng nhập");
        return;
      }

      if (rating === 0) {
        alert("Vui lòng chọn số sao đánh giá");
        return;
      }

      setIsSubmitting(true);

      const res = await fetch("http://localhost:3001/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          Users_ID: userId,
          Tour_Id: reviewingInvoice.tourId,
          Sosao: rating,
          Noidung: reviewText.trim(),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gửi đánh giá thất bại");
      }

      alert("Cảm ơn bạn đã đánh giá!");
      setReviewText("");
      setRating(0);
      setReviewingInvoice(null);
    } catch (err: any) {
      console.error("Lỗi gửi đánh giá:", err);
      alert(err.message || "Có lỗi xảy ra khi gửi đánh giá");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateServiceTotal = (invoice: InvoiceItem) => {
    return invoice.services.reduce((sum, service) => {
      return (
        sum +
        (service.giaNguoiLon || 0) * (invoice.adults || 0) +
        (service.giaTreEm || 0) * (invoice.children || 0)
      );
    }, 0);
  };

  const getStatusStyle = (status: string) => {
  switch (status) {
    case "Đã thanh toán":
      return { bg: "bg-[#D1FAE5]", text: "text-[#059669]" };
    case "Chờ thanh toán":
      return { bg: "bg-[#FEF3C7]", text: "text-[#D97706]" };
    case "Thanh toán thất bại":
      return { bg: "bg-[#FEE2E2]", text: "text-[#DC2626]" };
    case "Hoàn tiền":
      return { bg: "bg-[#EDE9FE]", text: "text-[#7C3AED]" };
    default:
      return { bg: "bg-[#FEF3C7]", text: "text-[#D97706]" };
  }
};

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#F5F5F5] flex justify-center items-center">
          <div className="text-black text-lg">Đang tải danh sách hóa đơn...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#F5F5F5] flex justify-center items-center flex-col gap-4">
          <div className="text-red-500 text-lg">Lỗi: {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#18AEE6] text-white rounded-full"
          >
            Thử lại
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Navbar />

      <div className="mx-auto w-[70%] py-10">
        <h1 className="text-[32px] font-semibold mb-6 text-black">Hóa đơn</h1>

        {paidInvoices.length === 0 ? (
          <div className="bg-white rounded-[24px] p-10 text-center">
            <p className="text-gray-500 text-lg">Bạn chưa có hóa đơn nào</p>
          </div>
        ) : (
          paidInvoices.map((invoice) => {
            const statusStyle = getStatusStyle(invoice.paymentStatus);
            const adultTotal = (invoice.tourAdultPrice || 0) * (invoice.adults || 0);
            const childTotal = (invoice.tourChildPrice || 0) * (invoice.children || 0);
            const serviceTotal = calculateServiceTotal(invoice);
            const subtotal = adultTotal + childTotal + serviceTotal;

            return (
              <div key={invoice.id} className="mb-10">
                <div className="bg-white rounded-[24px] border border-[#E5E7EB] shadow-sm overflow-hidden">
                  {/* Header */}
                  <div className="px-8 pt-6 pb-4 border-b border-[#F0F0F0]">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[#6B7280] text-sm mb-1">Hóa đơn #{invoice.bookingId}</p>
                        <div className="flex gap-3 items-center mt-1">
                          <span className="text-sm text-[#9CA3AF]">Ngày đặt: {invoice.bookingDate}</span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full flex items-center gap-1 ${statusStyle.bg}`}>
                        <AlertCircle className={`w-3.5 h-3.5 ${statusStyle.text}`} />
                        <span className={`text-xs font-medium ${statusStyle.text}`}>
                          {invoice.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Thông tin khách hàng */}
                  <div className="px-8 pt-6">
                    <h3 className="text-[#111827] font-semibold text-base mb-3">THÔNG TIN KHÁCH HÀNG</h3>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-8 text-sm mb-6">
                      <InfoRow label="Họ tên: " value={invoice.customerName} />
                      <InfoRow label="Số điện thoại: " value={invoice.customerPhone} />
                      <InfoRow label="Email: " value={invoice.customerEmail} />
                      <InfoRow label="Mã khách hàng: " value={invoice.customerCode} />
                    </div>
                  </div>

                  {/* Thông tin tour */}
                  <div className="px-8 pt-2 pb-4">
                    <h3 className="text-[#111827] font-semibold text-base mb-3">THÔNG TIN TOUR</h3>
                    <div className="mb-4">
                      <p className="text-[#111827] font-semibold text-lg">{invoice.tourName}</p>
                      <p className="text-[#6B7280] text-sm flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5" /> {invoice.location}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#6B7280]" />
                        <span className="text-[#6B7280]">Ngày khởi hành:</span>
                        <span className="text-[#111827] font-medium">{invoice.departureDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#6B7280]" />
                        <span className="text-[#6B7280]">Ngày kết thúc:</span>
                        <span className="text-[#111827] font-medium">{invoice.endDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#6B7280]" />
                        <span className="text-[#6B7280]">Người lớn:</span>
                        <span className="text-[#111827] font-medium">{invoice.adults} người</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#6B7280]" />
                        <span className="text-[#6B7280]">Trẻ em:</span>
                        <span className="text-[#111827] font-medium">{invoice.children} người</span>
                      </div>
                    </div>
                  </div>

                  {/* Chi tiết thanh toán */}
                  <div className="px-8 pt-4">
                    <h3 className="text-[#111827] font-semibold text-base mb-3">CHI TIẾT THANH TOÁN</h3>
                    <table className="w-full text-sm">
                      <thead className="border-b border-[#F0F0F0]">
                        <tr className="text-[#6B7280]">
                          <th className="text-left py-2 font-medium">Hạng mục</th>
                          <th className="text-right py-2 font-medium">Đơn giá</th>
                          <th className="text-right py-2 font-medium">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Tour */}
                        <tr className="border-b border-[#F5F5F5]">
                          <td className="py-3 text-[#111827]">
                            <div className="font-medium">{invoice.tourName}</div>
                            <div className="text-xs text-[#9CA3AF] mt-1">
                              {invoice.adults} người lớn
                              {invoice.children > 0 && ` • ${invoice.children} trẻ em`}
                            </div>
                          </td>
                          <td className="text-right text-[#111827]">
                            <div>NL: {formatMoney(invoice.tourAdultPrice)}</div>
                            {invoice.children > 0 && (
                              <div>TE: {formatMoney(invoice.tourChildPrice)}</div>
                            )}
                          </td>
                          <td className="text-right text-[#111827] font-medium">
                            {formatMoney(adultTotal + childTotal)}
                          </td>
                        </tr>

                        {/* Dịch vụ */}
                        {invoice.services.length > 0 ? (
                          invoice.services.map((service, idx) => {
                            const sTotal =
                              (service.giaNguoiLon || 0) * invoice.adults +
                              (service.giaTreEm || 0) * invoice.children;
                            return (
                              <tr key={idx} className="border-b border-[#F5F5F5]">
                                <td className="py-3 text-[#111827]">
                                  <div className="font-medium">{service.tenDichVu}</div>
                                  <div className="text-xs text-[#9CA3AF] mt-1">
                                    Dịch vụ đi kèm • {invoice.adults} người lớn • {invoice.children} trẻ em
                                  </div>
                                </td>
                                <td className="text-right text-[#111827]">
                                  <div>NL: {formatMoney(service.giaNguoiLon || 0)}</div>
                                  {invoice.children > 0 && (
                                    <div>TE: {formatMoney(service.giaTreEm || 0)}</div>
                                  )}
                                </td>
                                <td className="text-right text-[#111827] font-medium">
                                  {formatMoney(sTotal)}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={3} className="py-6 text-center text-[#9CA3AF]">
                              Không có dịch vụ thêm
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Tạm tính */}
                  <div className="px-8 pt-4 pb-6 border-t border-[#F0F0F0] mt-2">
                    <div className="flex justify-end">
                      <div className="w-72 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[#6B7280]">Vé người lớn</span>
                          <span className="text-[#111827]">{formatMoney(adultTotal)}</span>
                        </div>
                        {invoice.children > 0 && (
                          <div className="flex justify-between">
                            <span className="text-[#6B7280]">Vé trẻ em</span>
                            <span className="text-[#111827]">{formatMoney(childTotal)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-[#6B7280]">Dịch vụ thêm</span>
                          <span className="text-[#111827]">{formatMoney(serviceTotal)}</span>
                        </div>
                        <div className="flex justify-between border-b border-[#F0F0F0] pb-2">
                          <span className="text-[#6B7280]">Giảm giá</span>
                          <span className="text-[#111827]">- 0 ₫</span>
                        </div>
                        <div className="flex justify-between pt-2 font-semibold text-base">
                          <span className="text-[#111827]">Tổng cộng</span>
                          <span className="text-[#18AEE6]">{formatMoney(subtotal)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nút hành động */}
                <div className="flex justify-end gap-4 mt-4">
                  
                  
                  {invoice.trangthai === "Hoàn thành tour" && (
                    <button
                      onClick={() => setReviewingInvoice(invoice)}
                      className="h-[36px] px-6 rounded-full bg-[#18AEE6] font-semibold text-white hover:bg-[#0f8ab8] transition"
                    >
                      Viết đánh giá
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal chi tiết */}
      {detailInvoice && (
        <ModalOverlay>
          <div className="w-full max-w-[760px] rounded-[34px] border border-[#7F7F7F] bg-white px-8 py-7 max-h-[90vh] overflow-y-auto">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-[24px] font-semibold text-black">Chi tiết hóa đơn</h2>
              <button
                onClick={() => setDetailInvoice(null)}
                className="rounded-full p-1 text-[#555] hover:bg-[#F1F1F1]"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mb-6">
              <img
                src={detailInvoice.image}
                alt={detailInvoice.tourName}
                className="h-[220px] w-full rounded-[14px] object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb";
                }}
              />
            </div>
            <div className="space-y-4 text-[18px] text-black">
              <DetailLine label="Mã booking" value={detailInvoice.bookingId} />
              <DetailLine label="Tour" value={detailInvoice.tourName} />
              <DetailLine label="Địa điểm" value={detailInvoice.location} />
              <DetailLine label="Ngày đặt" value={detailInvoice.bookingDate} />
              <DetailLine label="Ngày khởi hành" value={detailInvoice.departureDate} />
              <DetailLine label="Ngày kết thúc" value={detailInvoice.endDate} />
              <DetailLine label="Số người lớn" value={`${detailInvoice.adults} người`} />
              <DetailLine label="Số trẻ em" value={`${detailInvoice.children} người`} />
              <DetailLine label="Trạng thái" value={detailInvoice.trangthai} />
              <DetailLine
                label="Tổng tiền"
                value={formatMoney(
                  (detailInvoice.tourAdultPrice * detailInvoice.adults) +
                  (detailInvoice.tourChildPrice * detailInvoice.children) +
                  calculateServiceTotal(detailInvoice)
                )}
              />
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setDetailInvoice(null)}
                className="flex h-[42px] min-w-[110px] items-center justify-center rounded-full bg-[#D9D9D9] px-8 text-[16px] font-semibold text-black"
              >
                Đóng
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* Modal đánh giá */}
      {reviewingInvoice && (
        <ModalOverlay>
          <div className="w-full max-w-[650px] rounded-[34px] border border-[#7F7F7F] bg-white px-8 py-7">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-[22px] font-semibold text-black">Đánh giá Tour</h2>
              <button
                onClick={() => { setReviewingInvoice(null); setRating(0); setReviewText(""); }}
                className="rounded-full p-1 text-[#555] hover:bg-[#F1F1F1]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="text-center text-[17px] font-semibold text-black">
              {reviewingInvoice.tourName}
            </div>
            <div className="mt-8 flex justify-center gap-4">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={`h-12 w-12 ${active ? "fill-yellow-400 text-yellow-400" : "fill-transparent text-[#4B5563]"}`}
                      strokeWidth={1.2}
                    />
                  </button>
                );
              })}
            </div>
            <div className="mt-4 text-center text-[16px] text-black">Chấm điểm tour của bạn</div>
            <div className="mt-8">
              <div className="mb-3 text-[16px] text-black">Viết đánh giá cho tour</div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Chia sẻ cảm nhận của bạn về tour..."
                className="h-[170px] w-full resize-none rounded-lg border border-[#D1D5DB] bg-white px-4 py-3 text-[16px] text-black outline-none focus:border-[#18AEE6] focus:ring-1 focus:ring-[#18AEE6]"
              />
            </div>
            <div className="mt-10 flex justify-center gap-4">
              <button
                onClick={() => { setReviewingInvoice(null); setRating(0); setReviewText(""); }}
                className="flex h-[48px] min-w-[150px] items-center justify-center rounded-full bg-[#D9D9D9] px-8 text-[16px] font-semibold text-black hover:bg-[#c0c0c0] transition"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={isSubmitting}
                className="flex h-[48px] min-w-[150px] items-center justify-center rounded-full bg-[#18AEE6] px-8 text-[16px] font-semibold text-white transition hover:bg-[#0f8ab8] disabled:opacity-60"
              >
                {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      <Footer />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex text-sm">
      <span className="text-[#6B7280] w-32 shrink-0">{label}</span>
      <span className="text-[#111827] font-medium">{value || "—"}</span>
    </div>
  );
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[220px_1fr] items-start gap-2 py-2 border-b border-[#F0F0F0]">
      <span className="font-semibold text-[#6B7280]">{label}:</span>
      <span className="text-[#111827]">{value || "—"}</span>
    </div>
  );
}

function ModalOverlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
      {children}
    </div>
  );
}