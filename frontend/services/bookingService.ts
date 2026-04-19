import { TourDetailResponse } from "@/types/booking";

const BASE_URL = "http://localhost:3001/api";

export const getTourById = async (id: string): Promise<TourDetailResponse["data"]> => {
  const res = await fetch(`${BASE_URL}/tours/view/${id}`);
  if (!res.ok) throw new Error(`Lỗi ${res.status}: Không tìm thấy tour`);

  const json: TourDetailResponse = await res.json();

  // In ra console để kiểm tra
  console.log("Tour:", json.data.tour);
  console.log("Schedules:", json.data.schedules);
  console.log("Prices:", json.data.tourPrices);
  console.log("Services:", json.data.tourServices);

  return json.data;
};