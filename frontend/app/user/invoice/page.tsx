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
  tourCode: string; //thêm mã tour
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
    tourCode: "TOUR01",
    tourName: "Núi bà đen",
    location: "Thành phố Tây Bắc",
    province: "Bắc Ninh",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    paymentDate: "2026-05-01",
    checkInDate: "2026-05-10",
    checkOutDate: "2026-05-12",
    paymentStatus: "chờ xác nhận",
    completionStatus: "chưa hoàn thành",
    total: 0,
    reviews: [],
  },
  {
    id: 2,
    code: "HD02",
    tourCode: "TOUR02",
    tourName: "Núi bà đen",
    location: "Thành phố Tây Bắc",
    province: "Bắc Ninh",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    paymentDate: "00/00/0000",
    checkInDate: "00/00/0000",
    checkOutDate: "00/00/0000",
    paymentStatus: "xác nhận",
    completionStatus: "hoàn thành",
    total: 0,
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
  return `${day}/${month}/${year}`;
}

export default function InvoiceReviewPage() {
  const [invoices, setInvoices] =
    useState<InvoiceItem[]>(initialInvoices);

  const [detailInvoice, setDetailInvoice] =
    useState<InvoiceItem | null>(null);

  const [reviewingInvoice, setReviewingInvoice] =
    useState<InvoiceItem | null>(null);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");



  const sortedInvoices = useMemo(() => {
    return [...invoices].sort((a, b) => a.id - b.id);
  }, [invoices]);

  const handleSubmitReview = () => {
    if (!reviewingInvoice) return;

    const newReview: ReviewItem = {
      id: Date.now(),
      rating,
      content: reviewText,
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

    setReviewingInvoice(null);
    setRating(0);
    setReviewText("");
  };

  return (
    <>
      <div className="min-h-screen bg-[#F5F5F5]">
        <Navbar />

        <div className="mx-auto w-[70%] py-10">
          <h1 className="text-[32px] font-semibold mb-10">
            Hóa đơn
          </h1>

          <div>
            {sortedInvoices.map((item) => (
              <div
                key={item.id}
                className="mb-10 border  bg-white px-14 py-10 border rounded-[20px]"
              >
                <div className="grid grid-cols-[180px_1fr] gap-12 ">
                  <div>
                    <img
                      src={item.image}
                      className="h-[150px] w-[170px] rounded-[14px] object-cover"
                    />

                    <div className="mt-8 text-[17px] font-semibold">
                      Trạng thái tour :
                      {item.completionStatus}
                    </div>
                  </div>

                  <div>
                    <h2 className="mb-8 text-[20px] font-semibold">
                      {getTourTitle(item)}
                    </h2>

                    <div className="grid grid-cols-[1fr_1fr_auto] gap-8">
                      <div className="space-y-2">
                        <InfoRow
                          label="Mã hoá đơn:"
                          value={item.code}
                        />
                        <InfoRow
                          label="Mã tour:"
                          value={item.tourCode}
                        />
                        <InfoRow
                          label="Ngày check-in:"
                          value={item.checkInDate}
                        />
                        <InfoRow
                          label="Ngày check-out:"
                          value={item.checkOutDate}
                        />
                      </div>

                      <div className="space-y-2">
                      </div>

                      <div className="flex flex-col items-end justify-end pt-10">
                        <InfoRow
                          label="Ngày thanh toán:"
                          value={item.paymentDate}
                        />
                        <InfoRow
                          label="Trạng thái tt:"
                          value={item.paymentStatus}
                        />
                        <div className="mb-5 text-[18px] font-semibold">
                          Tổng : {formatMoney(item.total)}
                        </div>

                        <div className="flex gap-6">
                          <button
                            onClick={() =>
                              setDetailInvoice(item)
                            }
                            className="h-[36px] min-w-[130px] rounded-full bg-[#D9D9D9] px-6 font-semibold"
                          >
                            chi tiết
                          </button>

                          {item.completionStatus ===
                            "hoàn thành" && (
                              <button
                                onClick={() => setReviewingInvoice(item)}
                                className="h-[36px] min-w-[150px] rounded-full bg-[#18AEE6] px-6 font-semibold text-white"
                              >
                                viết đánh giá
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MODAL CHI TIẾT */}

        {detailInvoice && (
          <ModalOverlay>
            <div className="w-full max-w-[760px] rounded-[34px] border border-[#7F7F7F] bg-white px-8 py-7">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-[24px] font-semibold text-black">
                  Chi tiết hóa đơn
                </h2>

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
                <DetailLine label="Ngày check-in" value={detailInvoice.checkInDate} />
                <DetailLine label="Ngày check-out" value={detailInvoice.checkOutDate} />
                <DetailLine
                  label="Trạng thái thanh toán"
                  value={detailInvoice.paymentStatus}
                />
                <DetailLine
                  label="Trạng thái tour"
                  value={detailInvoice.completionStatus}
                />
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

        {/* MODAL REVIEW */}

        {reviewingInvoice && (
          <ModalOverlay>
            <div className="w-full max-w-[650px] rounded-[34px] border border-[#7F7F7F] bg-white px-8 py-7">

              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-[22px] font-semibold text-black">
                  Đánh giá Tour
                </h2>

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

              {/* STAR RATING */}

              <div className="mt-8 flex justify-center gap-4">

                {[1, 2, 3, 4, 5].map((star) => {
                  const active =
                    (hoverRating || rating) >= star;

                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() =>
                        setHoverRating(star)
                      }
                      onMouseLeave={() =>
                        setHoverRating(0)
                      }
                      onClick={() =>
                        setRating(star)
                      }
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

              {/* TEXTAREA */}

              <div className="mt-8">

                <div className="mb-3 text-[16px] text-black">
                  Viết đánh giá cho tour
                </div>

                <textarea
                  value={reviewText}
                  onChange={(e) =>
                    setReviewText(e.target.value)
                  }
                  className="h-[170px] w-full resize-none border border-[#D1D5DB] bg-white px-4 py-3 text-[16px] text-black outline-none"
                />

              </div>

              {/* BUTTON */}

              <div className="mt-10 flex justify-center">

                <button
                  onClick={handleSubmitReview}
                  className="flex h-[48px] min-w-[300px] items-center justify-center rounded-full bg-[#18AEE6] px-8 text-[18px] font-semibold text-white transition hover:opacity-90"
                >
                  Gửi đánh giá
                </button>

              </div>

            </div>
          </ModalOverlay>
        )}

        <Footer />
      </div>
    </>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-[170px_1fr] text-[18px] font-semibold">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function DetailLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-[220px_1fr] items-start">
      <span className="font-semibold">{label}:</span>
      <span>{value}</span>
    </div>
  );
}

function ModalOverlay({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
      {children}
    </div>
  );
}