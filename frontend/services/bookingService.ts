import { TourDetailResponse , BookedTour  } from "@/types/booking";
const BASE_URL = "http://localhost:3001/api";
export const getTourById = async (id: string): Promise<TourDetailResponse["data"]> => {
  const res = await fetch(`${BASE_URL}/tours/view/${id}`);
  if (!res.ok) throw new Error(`Lỗi ${res.status}: Không tìm thấy tour`);
  const json: TourDetailResponse = await res.json();
  return json.data;
};
// Hàm gửi yêu cầu đặt tour
export const bookingService = async (tourId: string, data: any) => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(
    `${BASE_URL}/tours/book/${tourId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    }
  );
  const result = await res.json();
 if (!res.ok) {
  throw new Error(result?.error || result?.message || "Booking failed");
}
  return result;
};
// hàm hiển thị tour
export async function getBookedTourById(bookingId: string): Promise<BookedTour> {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`${BASE_URL}/tours/bookingDetail/${bookingId}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const text = await res.text();

  let result;
  try {
    result = JSON.parse(text);
  } catch {
    throw new Error("Server trả về dữ liệu không hợp lệ");
  }

  if (!res.ok || !result.success) {
    throw new Error(result?.message || "Không lấy được thông tin booking");
  }

  return result.data;
}
//vnpay
export async function createVnpayPayment(bookingId: string) {
  const res = await fetch("http://localhost:3001/api/vnpay/create-qr", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bookingId }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Không tạo được thanh toán");
  }

  return data;
}