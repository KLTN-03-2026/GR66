"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

type ActivityType = {
  _id: string;
  diaDiem: string;
  tenTour: string;
  hinhAnh: string[];
  giaTour: number;
  ngayKhoiHanh: string | null;
};

export default function ActivitySection() {
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/tours", {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Lỗi HTTP: ${res.status}`);
        }

        const data = await res.json();
        console.log("API tours:", data);

        if (data.success && Array.isArray(data.data)) {
          setActivities(data.data);
        } else {
          setActivities([]);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách tour:", error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  if (loading) {
    return (
      <div className="py-16 bg-white">
        <div className="max-w-screen-2xl mx-auto px-8">
          <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }
  const getImageUrl = (images?: string[]) => {
  const firstImage = images?.[0];

  if (!firstImage) return "/images/default-tour.jpg";

  if (firstImage.startsWith("http")) return firstImage;

  return `http://localhost:3001/${firstImage.replace(/^\/+/, "")}`;
};

  return (
    <div className="py-16 bg-white">
      <div className="max-w-screen-2xl mx-auto px-8">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Các hoạt động du lịch
            <div className="h-1 w-12 bg-orange-500 mt-3"></div>
          </h2>

          <Link
            href="#"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 text-lg"
          >
            Xem thêm <span className="text-xl">→</span>
          </Link>
        </div>

        {activities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {activities.map((item) => {
              const imageUrl =
                item.hinhAnh && item.hinhAnh.length > 0
                  ? `http://localhost:3001/uploads/${item.hinhAnh[0]}`
                  : null;

              console.log("Tên ảnh:", item.hinhAnh?.[0]);
              console.log("URL ảnh:", imageUrl);

              return (
                <div
                  key={item._id}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer"
                >
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.tenTour}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        Không có ảnh
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <p className="text-base font-medium text-gray-900 mb-2">
                      {item.diaDiem || "Chưa có địa điểm"}
                    </p>

                    <h3 className="font-semibold text-[17px] leading-tight text-gray-900 mb-4 line-clamp-2 min-h-[50px]">
                      {item.tenTour || "Chưa có tên tour"}
                    </h3>

                    <div className="mb-3 text-sm text-gray-600">
                      Ngày khởi hành:{" "}
                      {item.ngayKhoiHanh
                        ? new Date(item.ngayKhoiHanh).toLocaleDateString("vi-VN")
                        : "Chưa có lịch"}
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Từ</p>
                        <p className="font-bold text-2xl text-gray-900">
                          đ {Number(item.giaTour || 0).toLocaleString("vi-VN")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-8">
            Hiện chưa có tour nào.
          </p>
        )}
      </div>
    </div>
  );
}