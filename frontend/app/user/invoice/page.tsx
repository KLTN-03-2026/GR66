"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Star, X } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

type TourCompletionStatus = "chưa hoàn thành" | "hoàn thành";
type PaymentStatus = "chờ xác nhận" | "xác nhận";

type ReviewItem = {
  id: number;
  rating: number;
  content: string;
  createdAt: string;
};

type InvoiceItem = {
  id: number;
  code: string;
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
  reviews: ReviewItem[];
};

const initialInvoices: InvoiceItem[] = [
  {
    id: 1,
    code: "HD01",
    tourName: "Núi bà đen",
    location: "Thành phố Tây Bắc",
    province: "Bắc Ninh",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    paymentDate: "00/00/0000",
    checkInDate: "00/00/0000",
    checkOutDate: "00/00/0000",
    paymentStatus: "chờ xác nhận",
    completionStatus: "chưa hoàn thành",
    total: 0,
    reviews: [],
  },
  {
    id: 2,
    code: "HD02",
    tourName: "Núi bà đen",
    location: "Thành phố Tây Bắc",
    province: "Bắc Ninh",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
    paymentDate: "00/00/0000",
    checkInDate: "00/00/0000",
    checkOutDate: "00/00/0000",
    paymentStatus: "xác nhận",
    completionStatus: "hoàn thành",
    total: 0,
    reviews: [
      {
        id: 1,
        rating: 4,
        content:
          "Tour khá ổn, cảnh đẹp và lịch trình hợp lý. Hướng dẫn viên nhiệt tình, tuy nhiên phần ăn uống có thể cải thiện thêm.",
        createdAt: "20/07/2025 10:30",
      },
    ],
  },
  {
    id: 3,
    code: "HD03",
    tourName: "Bà Nà Hills",
    location: "Đà Nẵng",
    province: "Việt Nam",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1200&auto=format&fit=crop",
    paymentDate: "12/08/2025",
    checkInDate: "15/08/2025",
    checkOutDate: "16/08/2025",
    paymentStatus: "xác nhận",
    completionStatus: "hoàn thành",
    total: 2500000,
    reviews: [],
  },
];

function formatMoney(value: number) {
  return `${value.toLocaleString("vi-VN")} đ`;
}

function getTourTitle(item: InvoiceItem) {
  return `${item.tourName} | ${item.location} | ${item.province}`;
}

function getNowString() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hour}:${minute}`;
}

export default function InvoiceReviewPage() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>(initialInvoices);

  const [detailInvoice, setDetailInvoice] = useState<InvoiceItem | null>(null);
  const [reviewingInvoice, setReviewingInvoice] = useState<InvoiceItem | null>(null);
  const [viewingReviewInvoice, setViewingReviewInvoice] = useState<InvoiceItem | null>(null);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewError, setReviewError] = useState("");

  const sortedInvoices = useMemo(() => {
    return [...invoices].sort((a, b) => a.id - b.id);
  }, [invoices]);

  const openReviewModal = (invoice: InvoiceItem) => {
    setReviewingInvoice(invoice);
    setRating(0);
    setHoverRating(0);
    setReviewText("");
    setReviewError("");
  };

  const closeReviewModal = () => {
    setReviewingInvoice(null);
    setRating(0);
    setHoverRating(0);
    setReviewText("");
    setReviewError("");
  };

  const handleSubmitReview = () => {
    if (!reviewingInvoice) return;

    if (rating === 0) {
      setReviewError("Vui lòng chọn số sao đánh giá.");
      return;
    }

    if (!reviewText.trim()) {
      setReviewError("Vui lòng nhập nội dung đánh giá.");
      return;
    }

    const newReview: ReviewItem = {
      id: Date.now(),
      rating,
      content: reviewText.trim(),
      createdAt: getNowString(),
    };

    setInvoices((prev) =>
      prev.map((item) =>
        item.id === reviewingInvoice.id
          ? {
              ...item,
              reviews: [...item.reviews, newReview],
            }
          : item
      )
    );

    closeReviewModal();
  };

  useEffect(() => {
    if (!viewingReviewInvoice) return;
    const updatedInvoice =
      invoices.find((item) => item.id === viewingReviewInvoice.id) ?? null;
    setViewingReviewInvoice(updatedInvoice);
  }, [invoices, viewingReviewInvoice]);

  return (
    <><div>
        <Navbar />
      <div className="min-h-screen w-full bg-[#F5F5F5]">
        <div className="border-b border-[#8E8E8E]" />

        <div className="px-10 py-8">
          <h1 className="text-[34px] font-semibold text-black">Hóa đơn</h1>
        </div>

        <div className="border-b border-[#8E8E8E]" />

        <div className="w-full">
          {sortedInvoices.map((item) => (
            <div key={item.id}>
              <div className="px-10 py-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                  <div className="shrink-0">
                    <img
                      src={item.image}
                      alt={item.tourName}
                      className="h-[116px] w-[128px] rounded-[14px] object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h2 className="mb-5 text-[18px] font-semibold text-black">
                      {getTourTitle(item)}
                    </h2>

                    <div className="flex flex-col gap-6 xl:flex-row xl:justify-between">
                      <div className="grid grid-cols-1 gap-x-8 gap-y-1 md:grid-cols-2">
                        <InfoRow label="Mã hoá đơn:" value={item.code} />
                        <InfoRow label="Ngày thanh toán :" value={item.paymentDate} />
                        <InfoRow label="Ngày check-in :" value={item.checkInDate} />
                        <InfoRow label="Trạng thái tt :" value={item.paymentStatus} />
                        <InfoRow label="Ngày check-out :" value={item.checkOutDate} />
                      </div>

                      <div className="flex min-w-[230px] flex-col items-end justify-between">
                        <div className="pt-8 text-right text-[16px] font-semibold text-black">
                          Tổng : {formatMoney(item.total)}
                        </div>

                        <div className="mt-5 flex items-center gap-5">
                          <button
                            onClick={() => setDetailInvoice(item)}
                            className="flex h-[40px] min-w-[106px] items-center justify-center rounded-full bg-[#D9D9D9] px-6 text-[16px] font-semibold text-black transition hover:opacity-90"
                          >
                            chi tiết
                          </button>

                          {item.completionStatus === "hoàn thành" &&
                            (item.reviews.length > 0 ? (
                              <button
                                onClick={() => setViewingReviewInvoice(item)}
                                className="flex h-[40px] min-w-[136px] items-center justify-center rounded-full bg-[#18AEE6] px-6 text-[16px] font-semibold text-white transition hover:opacity-90"
                              >
                                xem đánh giá
                              </button>
                            ) : (
                              <button
                                onClick={() => openReviewModal(item)}
                                className="flex h-[40px] min-w-[136px] items-center justify-center rounded-full bg-[#18AEE6] px-6 text-[16px] font-semibold text-white transition hover:opacity-90"
                              >
                                viết đánh giá
                              </button>
                            ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 text-[18px] font-semibold text-black">
                      Trạng thái tour : {item.completionStatus}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b border-[#8E8E8E]" />
            </div>
          ))}
        </div>
      </div>

      {detailInvoice && (
        <ModalOverlay>
          <div className="w-full max-w-[760px] rounded-[34px] border border-[#7F7F7F] bg-white px-8 py-7">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[22px] font-semibold text-black">Chi tiết hóa đơn</h2>
              <button
                onClick={() => setDetailInvoice(null)}
                className="rounded-full p-1 text-[#555] hover:bg-[#F1F1F1]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-5">
              <img
                src={detailInvoice.image}
                alt={detailInvoice.tourName}
                className="h-[220px] w-full rounded-[18px] object-cover"
              />
            </div>

            <div className="space-y-3 text-[18px] text-black">
              <DetailLine label="Tour" value={getTourTitle(detailInvoice)} />
              <DetailLine label="Mã hóa đơn" value={detailInvoice.code} />
              <DetailLine label="Ngày thanh toán" value={detailInvoice.paymentDate} />
              <DetailLine label="Ngày check-in" value={detailInvoice.checkInDate} />
              <DetailLine label="Ngày check-out" value={detailInvoice.checkOutDate} />
              <DetailLine label="Trạng thái thanh toán" value={detailInvoice.paymentStatus} />
              <DetailLine label="Trạng thái tour" value={detailInvoice.completionStatus} />
              <DetailLine label="Tổng tiền" value={formatMoney(detailInvoice.total)} />
            </div>

            <div className="mt-7 flex justify-end">
              <button
                onClick={() => setDetailInvoice(null)}
                className="rounded-full bg-[#D9D9D9] px-8 py-2 text-[16px] font-semibold text-black"
              >
                Đóng
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {reviewingInvoice && (
        <ModalOverlay>
          <div className="w-full max-w-[760px] rounded-[34px] border border-[#7F7F7F] bg-white px-8 py-7">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-[22px] font-semibold text-black">Đánh giá Tour</h2>
              <button
                onClick={closeReviewModal}
                className="rounded-full p-1 text-[#555] hover:bg-[#F1F1F1]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-2">
              <div className="mt-6 text-center text-[17px] font-semibold text-black">
                {getTourTitle(reviewingInvoice)}
              </div>

              <div className="mt-7 flex justify-center gap-4">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating || rating) >= star;

                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => {
                        setRating(star);
                        if (reviewError) setReviewError("");
                      }}
                    >
                      <Star
                        className={`h-14 w-14 ${
                          active
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-transparent text-[#4B5563]"
                        }`}
                        strokeWidth={1.2}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 text-center text-[17px] text-black">
                Chấm điểm tour của bạn
              </div>

              <div className="mt-9">
                <div className="mb-3 text-[16px] text-black">Viết đánh giá cho tour</div>
                <textarea
                  value={reviewText}
                  onChange={(e) => {
                    setReviewText(e.target.value);
                    if (reviewError) setReviewError("");
                  }}
                  className="h-[170px] w-full resize-none border border-[#D1D5DB] bg-white px-4 py-3 text-[16px] text-black outline-none"
                />
                {reviewError && (
                  <div className="mt-2 text-[14px] text-red-500">{reviewError}</div>
                )}
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleSubmitReview}
                  className="flex h-[48px] min-w-[292px] items-center justify-center rounded-full bg-[#18AEE6] px-8 text-[18px] font-semibold text-white transition hover:opacity-90"
                >
                  Gửi đánh giá
                </button>
              </div>
            </div>
          </div>
        </ModalOverlay>
      )}

      {viewingReviewInvoice && viewingReviewInvoice.reviews.length > 0 && (
        <ModalOverlay>
          <div className="w-full max-w-[780px] rounded-[34px] border border-[#7F7F7F] bg-white px-8 py-7">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-[22px] font-semibold text-black">Xem đánh giá</h2>
              <button
                onClick={() => setViewingReviewInvoice(null)}
                className="rounded-full p-1 text-[#555] hover:bg-[#F1F1F1]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="text-center text-[18px] font-semibold text-black">
              {getTourTitle(viewingReviewInvoice)}
            </div>

            <div className="mt-8 max-h-[420px] space-y-4 overflow-y-auto pr-2">
              {viewingReviewInvoice.reviews.map((review, index) => (
                <div key={review.id} className="rounded-[18px] bg-[#F8F8F8] p-5">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div className="text-[16px] font-semibold text-black">
                      Đánh giá lần {index + 1}
                    </div>
                    <div className="text-[14px] text-[#555]">{review.createdAt}</div>
                  </div>

                  <div className="mb-4 flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = review.rating >= star;
                      return (
                        <Star
                          key={star}
                          className={`h-8 w-8 ${
                            active
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-transparent text-[#4B5563]"
                          }`}
                          strokeWidth={1.2}
                        />
                      );
                    })}
                  </div>

                  <div className="whitespace-pre-line text-[16px] text-black">
                    {review.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => setViewingReviewInvoice(null)}
                className="flex h-[42px] min-w-[120px] items-center justify-center rounded-full bg-[#D9D9D9] px-6 text-[16px] font-semibold text-black"
              >
                Đóng
              </button>
              <button
                onClick={() => openReviewModal(viewingReviewInvoice)}
                className="flex h-[42px] min-w-[170px] items-center justify-center rounded-full bg-[#18AEE6] px-6 text-[16px] font-semibold text-white"
              >
                Đánh giá tiếp
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}
      <Footer/>
      </div>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-[18px] font-semibold text-black">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-3">
      <span className="min-w-[210px] font-semibold">{label}:</span>
      <span>{value}</span>
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