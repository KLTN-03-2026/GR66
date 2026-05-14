"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Star, X, Clock, Banknote, Calendar, Users, MapPin, AlertCircle } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { jwtDecode } from "jwt-decode";
import { useBookedTour } from "@/hooks/useBooking";

type TourCompletionStatus = "chưa hoàn thành" | "hoàn thành";
type PaymentStatus =
  | "Chưa thanh toán"
  | "Đã thanh toán"
  | "Thanh toán thất bại"
  | "Đã hủy"
  | "Hết hạn";

type ReviewItem = {
  id: number;
  rating: number;
  content: string;
  createdAt: string;
};

type InvoiceItem = {
  id: number;
  code: string;
  tourId: string;
  tourCode: string;
  tourName: string;
  location: string;
  province: string;
  image: string;
  paymentDate: string;
  checkInDate: string;
  checkOutDate: string;
  paymentStatus: PaymentStatus;
  completionStatus: TourCompletionStatus;
  total: number;
  depositAmount?: number;
  remainingAmount?: number;
  reviews: ReviewItem[];
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerCode?: string;
  adults?: number;
  children?: number;
  departureDate?: string;
  endDate?: string;
  paymentDeadline?: string;
  bankAccount?: string;
  bankName?: string;
  bankHolder?: string;
  // ===== GIÁ TOUR =====
  tourAdultPrice?: number;
  tourChildPrice?: number;
  // ===== DỊCH VỤ =====
  services?: {
    tenDichVu: string;
    giaNguoiLon?: number;
    giaTreEm?: number;
    thanhTien?: number;
  }[];
};

type ServiceItem = {
  tenDichVu: string;
  gia?: number;
  giaNguoiLon?: number;
  soLuong?: number;
};

function formatMoney(value?: number) {
  if (!value) return "0 ₫";
  return `${value.toLocaleString("vi-VN")} ₫`;
}

function formatDateTime(dateStr: string | undefined | null): string {
  if (!dateStr) return "—";
  if (/^\d{14}$/.test(dateStr)) {
    const year = dateStr.slice(0, 4);
    const month = dateStr.slice(4, 6);
    const day = dateStr.slice(6, 8);
    const hour = dateStr.slice(8, 10);
    const minute = dateStr.slice(10, 12);
    return `${day}/${month}/${year} ${hour}:${minute}`;
  }
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1
  ).padStart(2, "0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function formatDateOnly(dateStr: string | undefined | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1
  ).padStart(2, "0")}/${d.getFullYear()}`;
}

function getTourTitle(item: InvoiceItem) {
  return `${item.tourName} | ${item.location}${item.province ? ` | ${item.province}` : ""}`;
}

export default function InvoiceReviewPage() {
  const { bookedTour, loading, error } = useBookedTour();

  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [detailInvoice, setDetailInvoice] = useState<InvoiceItem | null>(null);
  const [reviewingInvoice, setReviewingInvoice] = useState<InvoiceItem | null>(null);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userPhone, setUserPhone] = useState("");

  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
  const token = localStorage.getItem("accessToken");
  const userData = localStorage.getItem("user");
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      setUserId(decoded.userId);
      if (userData) {
        const user = JSON.parse(userData);
        console.log("USER:", user);
        setUserInfo(user);
        setUserName(user.hoten || "");
        setUserEmail(user.email || "");
      }
    } catch (err) {
      console.error("Lỗi localStorage/token:", err);
    }
  }
}, []);

  useEffect(() => {
    if (!bookedTour) {
      console.log("bookedTour chưa có");
      setInvoices([]);
      return;
    }
    console.log("BOOKED TOUR:", bookedTour);

    const mappedInvoices: InvoiceItem[] = [
      {
        id: 1,
        code: bookedTour.bookingId || "HDT-001",
        tourId: bookedTour.tour?._id || "",
        tourCode: bookedTour.tour?._id || "TOUR-001",
        tourName: bookedTour.tour?.tenTour || "Không có tên tour",
        location: bookedTour.tour?.diaDiem || "Không có địa điểm",
        province: "",
        image:
          bookedTour.tour?.hinhAnh?.[0] ||
          "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb",
        paymentDate: formatDateTime(bookedTour.ngayThanhToan),
        checkInDate: formatDateOnly(bookedTour.ngaydi),
        checkOutDate: formatDateOnly(bookedTour.ngayketthuc),
        paymentStatus: bookedTour.trangThaiThanhToan as PaymentStatus,
        completionStatus:
          bookedTour.trangThai === "Hoàn thành"
            ? "hoàn thành"
            : "chưa hoàn thành",
        total: bookedTour.tongTien || 0,
        remainingAmount: bookedTour.tongTien || 0,
        reviews: [],
        customerName: userName || "—",
        customerEmail: userEmail || "—",
        customerPhone: userInfo?.sdt || "—",
        customerCode: bookedTour.bookingId || "—",
        adults: bookedTour.soLuong?.nguoiLon || 0,
        children: bookedTour.soLuong?.treEm || 0,
        departureDate: formatDateOnly(bookedTour.ngaydi),
        endDate: formatDateOnly(bookedTour.ngayketthuc),
        paymentDeadline: formatDateTime(bookedTour.expireAt),
        bankHolder: "Công ty TNHH DTU Travel",
        // ===== GIÁ TOUR =====
        tourAdultPrice:
          bookedTour.giaCurrent?.nguoiLon || 0,

        tourChildPrice:
          bookedTour.giaCurrent?.treEm || 0,

        // ===== DỊCH VỤ =====
        services:
          bookedTour.dichVu?.map((dv: any) => ({
            tenDichVu: dv.tenDichVu,

            giaNguoiLon: dv.donGia?.nguoiLon || 0,

            giaTreEm: dv.donGia?.treEm || 0,

            thanhTien: dv.thanhTien || 0,
          })) || [],
      },
    ];

    setInvoices(mappedInvoices);
  }, [bookedTour, userName, userEmail]);

  const sortedInvoices = useMemo(() => {
    return [...invoices].sort((a, b) => a.id - b.id);
  }, [invoices]);

  const handleSubmitReview = async () => {
    try {
      if (!reviewingInvoice) return;

      const token = localStorage.getItem("accessToken");
      if (!token || !userId) {
        alert("Chưa đăng nhập");
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

      const text = await res.text();
      console.log("RESPONSE RAW:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Response không phải JSON");
      }

      if (!res.ok) {
        throw new Error(data.message || "API lỗi");
      }

      alert("Đánh giá thành công!");
      setReviewText("");
      setRating(0);
      setReviewingInvoice(null);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("LỖI THẬT:", err.message);
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="w-full flex justify-center mt-10 text-black">
          Đang tải thông tin booking...
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="w-full flex justify-center mt-10 text-red-500">{error}</div>
        <Footer />
      </>
    );
  }

  const calculateServiceTotal = (
    services?: InvoiceItem["services"],
    adults: number = 0,
    children: number = 0
  ) => {
    if (!services || services.length === 0) return 0;

    return services.reduce((total, service) => {
      return (
        total +
        ((service.giaNguoiLon || 0) * adults) +
        ((service.giaTreEm || 0) * children)
      );
    }, 0);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Navbar />

      <div className="mx-auto w-[70%] py-10">
        <h1 className="text-[32px] font-semibold mb-6 text-black">Hóa đơn</h1>

        {sortedInvoices.map((invoice) => (
          <div key={invoice.id} className="mb-10">
            <div className="bg-white rounded-[24px] border border-[#E5E7EB] shadow-sm overflow-hidden">
              {/* Header */}
              <div className="px-8 pt-6 pb-4 border-b border-[#F0F0F0]">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[#6B7280] text-sm mb-1">Hóa đơn #{invoice.code}</p>
                    <div className="flex gap-3 items-center mt-1">
                      <span className="text-sm text-[#9CA3AF]">Ngày xuất: {invoice.paymentDate}</span>
                      <span className="text-sm text-[#9CA3AF]">Đặt ngày: {invoice.paymentDate}</span>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full flex items-center gap-1 ${invoice.paymentStatus === "Đã thanh toán"
                        ? "bg-[#D1FAE5]"
                        : invoice.paymentStatus === "Thanh toán thất bại"
                          ? "bg-[#FEE2E2]"
                          : invoice.paymentStatus === "Đã hủy"
                            ? "bg-[#F3F4F6]"
                            : "bg-[#FEF3C7]"
                      }`}
                  >
                    <AlertCircle
                      className={`w-3.5 h-3.5 ${invoice.paymentStatus === "Đã thanh toán"
                          ? "text-[#059669]"
                          : invoice.paymentStatus === "Thanh toán thất bại"
                            ? "text-[#DC2626]"
                            : invoice.paymentStatus === "Đã hủy"
                              ? "text-[#6B7280]"
                              : "text-[#D97706]"
                        }`}
                    />

                    <span
                      className={`text-xs font-medium ${invoice.paymentStatus === "Đã thanh toán"
                          ? "text-[#059669]"
                          : invoice.paymentStatus === "Thanh toán thất bại"
                            ? "text-[#DC2626]"
                            : invoice.paymentStatus === "Đã hủy"
                              ? "text-[#6B7280]"
                              : "text-[#D97706]"
                        }`}
                    >
                      {invoice.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Thông tin khách hàng */}
              <div className="px-8 pt-6">
                <h3 className="text-[#111827] font-semibold text-base mb-3">THÔNG TIN KHÁCH HÀNG</h3>
                <div className="grid grid-cols-2 gap-y-2 gap-x-8 text-sm mb-6">
                  <InfoRow label="Họ tên" value={invoice.customerName || "—"} />
                  <InfoRow label="Số điện thoại" value={invoice.customerPhone || "—"} />
                  <InfoRow label="Email" value={invoice.customerEmail || "—"} />
                  <InfoRow label="Mã khách hàng" value={invoice.customerCode || "—"} />
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
                <h3 className="text-[#111827] font-semibold text-base mb-3">
                  CHI TIẾT THANH TOÁN
                </h3>

                <table className="w-full text-sm">
                  <thead className="border-b border-[#F0F0F0]">
                    <tr className="text-[#6B7280]">
                      <th className="text-left py-2 font-medium">Hạng mục</th>
                      <th className="text-right py-2 font-medium">Đơn giá</th>
                      <th className="text-right py-2 font-medium">Thành tiền</th>
                    </tr>
                  </thead>

                  <tbody>
                    {/* TOUR */}
                    <tr className="border-b border-[#F5F5F5]">
                      <td className="py-3 text-[#111827]">
                        <div className="font-medium">
                          {invoice.tourName}
                        </div>

                        <div className="text-xs text-[#9CA3AF] mt-1">
                          {invoice.adults || 0} người lớn
                          {(invoice.children || 0) > 0 &&
                            ` • ${invoice.children || 0} trẻ em`}
                        </div>
                      </td>

                      <td className="text-right text-[#111827]">
                        <div>
                          NL: {formatMoney(invoice.tourAdultPrice || 0)}
                        </div>

                        {(invoice.children || 0) > 0 && (
                           <div className="text-right text-[#111827]">
                            TE: {formatMoney(invoice.tourChildPrice || 0)}
                          </div>
                        )}
                      </td>

                      <td className="text-right text-[#111827] font-medium">
                        {formatMoney(
                          ((invoice.tourAdultPrice || 0) *
                            (invoice.adults || 0)) +
                          ((invoice.tourChildPrice || 0) *
                            (invoice.children || 0))
                        )}
                      </td>
                    </tr>

                    {/* DỊCH VỤ THÊM */}
                    {invoice.services &&
                      invoice.services.length > 0 &&
                      invoice.services.map((service, index) => {
                        const serviceTotal =
                          ((service.giaNguoiLon || 0) * (invoice.adults || 0)) +
                          ((service.giaTreEm || 0) * (invoice.children || 0));

                        return (
                          <tr
                            key={index}
                            className="border-b border-[#F5F5F5]"
                          >
                            <td className="py-3 text-[#111827]">
                              <div className="font-medium">
                                {service.tenDichVu}
                              </div>

                              <div className="text-xs text-[#9CA3AF] mt-1">
                                Dịch vụ đi kèm •{" "}
                                {invoice.adults || 0} người lớn •{" "}
                                {invoice.children || 0} trẻ em
                              </div>
                            </td>

                            <td className="text-right text-[#111827]">
                              <div>
                                NL: {formatMoney(service.giaNguoiLon || 0)}
                              </div>

                              {(invoice.children || 0) > 0 && (
                               <div className="text-right text-[#111827]">
                                  TE: {formatMoney(service.giaTreEm || 0)}
                                </div>
                              )}
                            </td>

                            <td className="text-right text-[#111827] font-medium">
                              {formatMoney(serviceTotal)}
                            </td>
                          </tr>
                        );
                      })}

                    {/* KHÔNG CÓ DỊCH VỤ */}
                    {(!invoice.services ||
                      invoice.services.length === 0) && (
                        <tr>
                          <td
                            colSpan={3}
                            className="py-6 text-center text-[#9CA3AF]"
                          >
                            Không có dịch vụ thêm
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>

              {/* Tạm tính */}
              {/* Tạm tính */}
              <div className="px-8 pt-4 pb-2 border-t border-[#F0F0F0] mt-2">
                <div className="flex justify-end">
                  <div className="w-72 space-y-2 text-sm">

                    {(() => {
                      const adultTotal =
                        (invoice.tourAdultPrice || 0) *
                        (invoice.adults || 0);

                      const childTotal =
                        (invoice.tourChildPrice || 0) *
                        (invoice.children || 0);

                      const serviceTotal = calculateServiceTotal(
                        invoice.services,
                        invoice.adults || 0,
                        invoice.children || 0
                      );

                      const subtotal =
                        adultTotal +
                        childTotal +
                        serviceTotal;

                      return (
                        <>
                          {/* Vé người lớn */}
                          <div className="flex justify-between">
                            <span className="text-[#6B7280]">
                              Vé người lớn
                            </span>

                            <span className="text-[#111827]">
                              {formatMoney(adultTotal)}
                            </span>
                          </div>

                          {/* Vé trẻ em */}
                          {(invoice.children || 0) > 0 && (
                            <div className="flex justify-between">
                              <span className="text-[#6B7280]">
                                Vé trẻ em
                              </span>

                              <span className="text-[#111827]">
                                {formatMoney(childTotal)}
                              </span>
                            </div>
                          )}

                          {/* Dịch vụ */}
                          <div className="flex justify-between">
                            <span className="text-[#6B7280]">
                              Dịch vụ thêm
                            </span>

                            <span className="text-[#111827]">
                              {formatMoney(serviceTotal)}
                            </span>
                          </div>

                          <div className="flex justify-between border-b border-[#F0F0F0] pb-2">
                            <span className="text-[#6B7280]">
                              Giảm giá
                            </span>

                            <span className="text-[#111827]">
                              - 0 ₫
                            </span>
                          </div>

                          {/* Tổng */}
                          <div className="flex justify-between pt-2 font-semibold text-base">
                            <span className="text-[#111827]">
                              Tổng cộng
                            </span>

                            <span className="text-[#18AEE6]">
                              {formatMoney(subtotal)}
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

            </div>

            {/* Nút xem chi tiết & viết đánh giá */}
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setDetailInvoice(invoice)}
                className="h-[36px] px-6 rounded-full bg-[#E5E7EB] font-medium text-[#111827] hover:bg-[#D1D5DB] transition"
              >
                Xem chi tiết
              </button>
              {invoice.completionStatus === "hoàn thành" && (
                <button
                  onClick={() => setReviewingInvoice(invoice)}
                  className="h-[36px] px-6 rounded-full bg-[#18AEE6] font-semibold text-white hover:bg-[#0f8ab8] transition"
                >
                  Viết đánh giá
                </button>
              )}
            </div>
          </div>
        ))}

        {!loading && invoices.length === 0 && (
          <div className="text-center text-gray-500 text-lg">Không có hóa đơn nào</div>
        )}
      </div>

      {/* Modal chi tiết hóa đơn */}
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
              />
            </div>
            <div className="space-y-4 text-[18px] text-black">
              <DetailLine label="Tour" value={getTourTitle(detailInvoice)} />
              <DetailLine label="Mã hóa đơn" value={detailInvoice.code} />
              <DetailLine label="Mã tour" value={detailInvoice.tourCode} />
              <DetailLine label="Ngày thanh toán" value={detailInvoice.paymentDate} />
              <DetailLine
                label="Ngày khởi hành"
                value={detailInvoice.departureDate || detailInvoice.checkInDate}
              />
              <DetailLine label="Ngày kết thúc" value={detailInvoice.endDate || detailInvoice.checkOutDate} />
              <DetailLine label="Trạng thái tour" value={detailInvoice.completionStatus} />
              <DetailLine label="Tổng tiền" value={formatMoney(detailInvoice.total)} />
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
                onClick={() => setReviewingInvoice(null)}
                className="rounded-full p-1 text-[#555] hover:bg-[#F1F1F1]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="text-center text-[17px] font-semibold text-black">
              {getTourTitle(reviewingInvoice)}
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
                      className={`h-12 w-12 ${active
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-transparent text-[#4B5563]"
                        }`}
                      strokeWidth={1.2}
                    />
                  </button>
                );
              })}
            </div>
            <div className="mt-4 text-center text-[16px] text-black">
              Chấm điểm tour của bạn
            </div>
            <div className="mt-8">
              <div className="mb-3 text-[16px] text-black">Viết đánh giá cho tour</div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Chia sẻ cảm nhận của bạn về tour..."
                className="h-[170px] w-full resize-none rounded-lg border border-[#D1D5DB] bg-white px-4 py-3 text-[16px] text-black outline-none"
              />
            </div>
            <div className="mt-10 flex justify-center">
              <button
                onClick={handleSubmitReview}
                disabled={isSubmitting}
                className="flex h-[48px] min-w-[300px] items-center justify-center rounded-full bg-[#18AEE6] px-8 text-[18px] font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
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
      <span className="text-[#111827] font-medium">{value}</span>
    </div>
  );
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[220px_1fr] items-start gap-2">
      <span className="font-semibold">{label}:</span>
      <span className="text-[#374151]">{value}</span>
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