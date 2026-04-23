/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getTourById } from "@/services/bookingService";
import { TourRaw, ScheduleRaw, TourPriceRaw, TourServiceRaw, Review } from "@/types/booking";

export const useExtraDetail = () => {
    const [expandedExtras, setExpandedExtras] = useState<string[]>([]);
    // bật tắt thêm chi tiết thông tin
    const toggleExtraDetail = (id: string) => {
        if (expandedExtras.includes(id)) {
            setExpandedExtras((prev) => prev.filter((item) => item !== id));
        } else {
            setExpandedExtras((prev) => [...prev, id]);
        }
    };
    return {
        expandedExtras,
        toggleExtraDetail,
    };
};

export const useBooking = () => {
    const [checkInDate, setCheckInDate] = useState(""); // lưu ngày người dùng . ban đầu để rỗng
    const [checkInError, setCheckInError] = useState(""); // thông báo lỗi, ban đầu để rỗng
    const today = new Date().toISOString().split("T")[0];  // lấy ngày tháng năm hôm nay dùng để so sánh với ngày user chọn

    const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => { //e là sự kiện khi người dùng thay đổi giá trị của một input
        const selectedDate = e.target.value;  //Lấy dữ liệu người dùng nhập
        if (selectedDate < today) {  // kiểm tra ngày hôm nay
            setCheckInError("Không thể chọn ngày trước hôm nay");  // thông báo lỗi 
            setCheckInDate("");
            return;
        }
        //Trường hợp hợp lệ
        setCheckInError("");
        setCheckInDate(selectedDate);
    };
    return {  // trả về dữ liệu
        checkInDate,
        checkInError,
        handleCheckInChange,
        today
    };
};

export const useSelectedExtras = () => {
    const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

    // chọn bỏ dịch vụ thêm , chọn nhiều option trong form, xử lý checkbox list
    const toggleExtra = (id: string) => {
        if (selectedExtras.includes(id)) {
            setSelectedExtras((prev) => prev.filter((item) => item !== id));
        } else {
            setSelectedExtras((prev) => [...prev, id]);
        }
    };
    return {
        selectedExtras,
        setSelectedExtras,
        toggleExtra
    }
}

export const useAdultCount = () => {
    const [adult, setAdult] = useState(1);
    const [child, setChild] = useState(0);
    const baseAdultCount = adult > 0 ? adult : 1;
    return {
        adult,
        setAdult,
        child,
        setChild,
        baseAdultCount
    }
}

export const useReview = (reviews: Review[]) => {
    const [visibleReviews, setVisibleReviews] = useState(4);

    const totalReviews = reviews.length;

    const averageRating =
        totalReviews > 0
            ? reviews.reduce((sum, item) => sum + item.Sosao, 0) / totalReviews
            : 0;

    // 🔥 reset khi API thay đổi
    useEffect(() => {
        setVisibleReviews(4);
    }, [reviews]);

    const handleLoadMore = () => {
        setVisibleReviews(prev => Math.min(prev + 4, totalReviews));
    };

    return {
        reviews,
        totalReviews,
        averageRating,
        visibleReviews,
        handleLoadMore
    };
};

interface TourDetail {
    tour: TourRaw;
    schedules: ScheduleRaw[];
    tourPrices: TourPriceRaw[];
    tourServices: TourServiceRaw[];
    reviews: Review[];
}

export const useTourDetail = () => {
    const searchParams = useSearchParams();
    const tourId = searchParams.get("tourId");

    const [data, setData] = useState<TourDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!tourId) return;

        const fetch = async () => {
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

        fetch();
    }, [tourId]);
    const tour = data?.tour ?? null;  // Lấy tour từ data, nếu không có thì trả về null
    const schedules = data?.schedules ?? [];
    const price = data?.tourPrices?.[0] ?? null;   // lấy giá đầu tiên
    const services = data?.tourServices ?? [];
    const reviews = data?.reviews ?? [];  // Lấy đánh giá từ tourData
    return { tour, schedules, price, services, reviews , loading, error, tourId };
};