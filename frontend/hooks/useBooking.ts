"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
// useBooking.ts — dòng import ở đầu file, thay dòng cũ
import { bookingService, getTourById, getBookedTourById, PendingBookingError, viewBooking  } from "@/services/bookingService";
import { TourServiceRaw, TourPriceRaw, TourDetail, Review, BookedTour } from "@/types/booking";
import { useRouter } from "next/navigation";

const BASE_URL = "http://localhost:3001/api";

export const useExtraDetail = () => {
  const [expandedExtras, setExpandedExtras] = useState<string[]>([]);

  const toggleExtraDetail = (id: string) => {
    setExpandedExtras((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  return { expandedExtras, toggleExtraDetail };
};

export const useBooking = () => {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkInError, setCheckInError] = useState("");
  const today = new Date().toISOString().split("T")[0];

  const handleCheckInChange = (selectedDate: string) => {
    if (selectedDate < today) {
      setCheckInError("Không thể chọn ngày trước hôm nay");
      return;
    }
    setCheckInError("");
    setCheckInDate(selectedDate);
  };

  return { checkInDate, checkInError, handleCheckInChange, today };
};

export const handleBooking = ({
  services,
  selectedExtras,
  adultCount,
  childCount,
  price,
}: {
  services: TourServiceRaw[];
  selectedExtras: string[];
  adultCount: number;
  childCount: number;
  price: TourPriceRaw | null;
}) => {
  const extraTotal = services
    .filter((service) => selectedExtras.includes(service._id))
    .reduce((sum, service) => {
      const adultExtra = (service.giaApDungNguoiLon ?? 0) * adultCount;
      const childExtra = (service.giaApDungTreEm ?? 0) * childCount;
      return sum + adultExtra + childExtra;
    }, 0);

  const totalPrice =
    (price?.giaNguoiLon ?? 0) * adultCount +
    (price?.giaTreEm ?? 0) * childCount;

  const total = totalPrice + extraTotal;

  return { total, totalPrice, extraTotal };
};

export const useSelectedExtras = () => {
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return { selectedExtras, setSelectedExtras, toggleExtra };
};

export const useAdultCount = () => {
  const [adult, setAdult] = useState(1);
  const [child, setChild] = useState(0);

  return { adult, setAdult, child, setChild };
};

export const useReview = (reviews: Review[]) => {
  const [visibleReviews, setVisibleReviews] = useState(4);

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, item) => sum + item.Sosao, 0) / totalReviews
      : 0;

  useEffect(() => {
    setVisibleReviews(4);
  }, [reviews]);

  const handleLoadMore = () => {
    setVisibleReviews((prev) => Math.min(prev + 4, totalReviews));
  };

  return { totalReviews, averageRating, visibleReviews, handleLoadMore };
};

export const useTourDetail = () => {
  const searchParams = useSearchParams();
  const tourId = searchParams.get("tourId");
  const [data, setData] = useState<TourDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tourId) return;
    const fetchTour = async () => {
      setLoading(true);
      try {
        const result = await getTourById(tourId);
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [tourId]);

  return {
    tour: data?.tour ?? null,
    schedules: data?.schedules ?? [],
    price: data?.tourPrices?.[0] ?? null,
    services: data?.tourServices ?? [],
    reviews: data?.reviews ?? [],
    loading,
    error,
    tourId,
  };
};

//Hàm cancel booking — dùng chung
export const cancelBooking = async (bookingId: string) => {
  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const res = await fetch(`${BASE_URL}/tours/booking/${bookingId}/cancel`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ userId: user._id }),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result?.message || "Huỷ thất bại");
  return result;
};

//useBookingSubmit — phiên bản mới gộp đầy đủ
export const useBookingSubmit = () => {
  const router = useRouter();

  const [pendingModal, setPendingModal] = useState<{
    open: boolean;
    bookingId: string;
    secondsLeft: number;
  }>({ open: false, bookingId: "", secondsLeft: 0 });

  const handleBookingClick = async ({
    tourId,
    adult,
    child,
    checkInDate,
    tourServiceIds,
  }: {
    tourId: string;
    adult: number;
    child: number;
    checkInDate: string;
    tourServiceIds: string[];
  }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user?._id;
      if (!userId) return alert("Vui lòng đăng nhập để đặt tour");
      if (!tourId) return alert("Không tìm thấy tour");
      if (!checkInDate) return alert("Vui lòng chọn ngày khởi hành");
      const [year, month, day] = checkInDate.split("-").map(Number);
      const normalizedDate = new Date(Date.UTC(year, month - 1, day)).toISOString();
      const res = await bookingService(tourId, {
        userId,
        tourId,
        tourServiceIds,
        soluongnguoilon: adult,
        soluongtreem: child,
        ngaydi: normalizedDate,
      });

      const bookingId = res?.data?.booking?._id;
      if (!bookingId) throw new Error("Không tìm thấy bookingId");

      router.push(`/user/bookingDetail?bookingId=${bookingId}`);

    } catch (err: any) {
      if (err instanceof PendingBookingError) {
        setPendingModal({
          open: true,
          bookingId: err.bookingId,
          secondsLeft: err.secondsLeft,
        });
        console.log("hàm setPendingModal được gọi", err.bookingId);
        return;
      }
      alert("Lỗi đặt tour: " + err.message);
    }
  };

  const handleContinuePayment = () => {
    router.push(`/user/bookingDetail?bookingId=${pendingModal.bookingId}`);
    setPendingModal({ open: false, bookingId: "", secondsLeft: 0 });
  };

  const handleCancelAndRebook = async (
    tourId: string,
    adult: number,
    child: number,
    checkInDate: string,
    tourServiceIds: string[]
  ) => {
    try {
      await cancelBooking(pendingModal.bookingId);
      setPendingModal({ open: false, bookingId: "", secondsLeft: 0 });
      await handleBookingClick({ tourId, adult, child, checkInDate, tourServiceIds });
    } catch (err: any) {
      alert("Lỗi huỷ booking: " + err.message);
    }
  };

  return {
    handleBookingClick,
    handleContinuePayment,
    handleCancelAndRebook,
    pendingModal,
    setPendingModal,
  };
};


// hiển thị tour đã đặt
export const useBookedTour = () => {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [bookedTour, setBookedTour] = useState<BookedTour | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    if (!bookingId) return;
    const fetchBookedTour = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBookedTourById(bookingId);
        setBookedTour(data);
      } catch (err: any) {
        setError(err.message || "Lỗi khi lấy thông tin booking");
      } finally {
        setLoading(false);
      }
    };
    fetchBookedTour();
  }, [bookingId]);

  return {
    bookedTour,
    loading,
    error,
    bookingId,
  };
};


// hiển thị danh sách booking của user
export const useViewBooking = () => {
  const [bookings, setBookings] = useState<BookedTour[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await viewBooking();
        setBookings(data);
      } catch (err: any) {
        setError(err.message || "Lỗi khi lấy danh sách booking");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);
  return {
    bookings,
    loading,
    error,
  };
};