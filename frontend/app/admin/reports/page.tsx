"use client";

import React, { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Bell } from "lucide-react";

type OrderRecord = {
  id: number;
  date: string;
  customerName: string;
  tourName: string;
  quantity: number;
  revenue: number;
};

const mockOrders: OrderRecord[] = [
  {
    id: 1,
    date: "2024-03-01",
    customerName: "Nguyễn An",
    tourName: "Tour A",
    quantity: 1,
    revenue: 320000000,
  },
  {
    id: 2,
    date: "2024-03-01",
    customerName: "Lê Bình",
    tourName: "Tour B",
    quantity: 1,
    revenue: 210000000,
  },
  {
    id: 3,
    date: "2024-03-01",
    customerName: "Trần Chi",
    tourName: "Tour A",
    quantity: 1,
    revenue: 470000000,
  },
  {
    id: 4,
    date: "2024-03-02",
    customerName: "Phạm Duy",
    tourName: "Tour A",
    quantity: 1,
    revenue: 520000000,
  },
  {
    id: 5,
    date: "2024-03-02",
    customerName: "Vũ Em",
    tourName: "Tour C",
    quantity: 1,
    revenue: 360000000,
  },
  {
    id: 6,
    date: "2024-03-02",
    customerName: "Đỗ Phương",
    tourName: "Tour A",
    quantity: 1,
    revenue: 410000000,
  },
  {
    id: 7,
    date: "2024-03-02",
    customerName: "Ngô Huy",
    tourName: "Tour B",
    quantity: 1,
    revenue: 210000000,
  },
  {
    id: 8,
    date: "2024-03-03",
    customerName: "Bùi Giang",
    tourName: "Tour B",
    quantity: 1,
    revenue: 300000000,
  },
  {
    id: 9,
    date: "2024-03-03",
    customerName: "Mai Hân",
    tourName: "Tour A",
    quantity: 1,
    revenue: 270000000,
  },
  {
    id: 10,
    date: "2024-03-03",
    customerName: "Phan Khoa",
    tourName: "Tour C",
    quantity: 1,
    revenue: 180000000,
  },
  {
    id: 11,
    date: "2024-03-03",
    customerName: "Tạ Linh",
    tourName: "Tour D",
    quantity: 1,
    revenue: 274567890,
  },
];

const DEFAULT_FROM = "2024-03-01";
const DEFAULT_TO = "2024-03-03";

function formatCurrency(value: number) {
  return value.toLocaleString("vi-VN");
}

function getDateRange(from: string, to: string) {
  if (!from || !to || from > to) return [] as string[];

  const result: string[] = [];
  const current = new Date(`${from}T00:00:00`);
  const end = new Date(`${to}T00:00:00`);

  while (current <= end) {
    const y = current.getFullYear();
    const m = `${current.getMonth() + 1}`.padStart(2, "0");
    const d = `${current.getDate()}`.padStart(2, "0");
    result.push(`${y}-${m}-${d}`);
    current.setDate(current.getDate() + 1);
  }

  return result;
}

function StatCard({
  value,
  label,
  bgClass,
}: {
  value: string;
  label: string;
  bgClass: string;
}) {
  return (
    <div className={`h-[116px] rounded-[10px] px-5 py-4 text-white ${bgClass}`}>
      <div className="text-[28px] font-bold leading-none">{value}</div>
      <div className="mt-4 text-[17px] font-semibold leading-none">{label}</div>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[16px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <h3 className="mb-5 text-[16px] font-bold text-[#111827]">{title}</h3>
      <div className="h-[250px] w-full">{children}</div>
    </div>
  );
}

export default function Page() {
  const [fromDate, setFromDate] = useState(DEFAULT_FROM);
  const [toDate, setToDate] = useState(DEFAULT_TO);

  const safeRange = useMemo(() => {
    if (!fromDate || !toDate || fromDate > toDate) return null;
    return { from: fromDate, to: toDate };
  }, [fromDate, toDate]);

  const filteredOrders = useMemo(() => {
    if (!safeRange) return [];

    return mockOrders.filter(
      (order) => order.date >= safeRange.from && order.date <= safeRange.to,
    );
  }, [safeRange]);

  const stats = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const totalCustomers = new Set(
      filteredOrders.map((item) => item.customerName),
    ).size;
    const totalRevenue = filteredOrders.reduce(
      (sum, item) => sum + item.revenue,
      0,
    );

    return {
      totalOrders,
      totalCustomers,
      totalRevenue,
    };
  }, [filteredOrders]);

  const revenueChartData = useMemo(() => {
    if (!safeRange) return [];

    const allDates = getDateRange(safeRange.from, safeRange.to);

    return allDates.map((date) => {
      const revenue = filteredOrders
        .filter((item) => item.date === date)
        .reduce((sum, item) => sum + item.revenue, 0);

      return {
        date,
        revenue: Math.round(revenue / 1000000),
      };
    });
  }, [filteredOrders, safeRange]);

  const topToursData = useMemo(() => {
    const grouped = filteredOrders.reduce<Record<string, number>>(
      (acc, item) => {
        acc[item.tourName] = (acc[item.tourName] || 0) + item.quantity;
        return acc;
      },
      {},
    );

    return Object.entries(grouped)
      .map(([tourName, quantity]) => ({ tourName, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [filteredOrders]);

  return (
    <div className="min-h-screen w-full bg-[#F5F6F8] px-4 py-6 md:px-6 lg:px-8">
      <div className="w-full">
        <h1 className="mb-6 text-[36px] font-semibold tracking-tight text-[#111827]">
          Báo cáo thống kê
        </h1>

        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:gap-10">
          <div className="flex items-center gap-3">
            <label htmlFor="fromDate" className="text-[16px] text-[#111827]">
              Từ ngày:
            </label>
            <input
              id="fromDate"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-[38px] w-[170px] rounded-[10px] border border-[#A8ADB7] bg-white px-4 text-[14px] text-[#111827] outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="toDate" className="text-[16px] text-[#111827]">
              Đến ngày:
            </label>
            <input
              id="toDate"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-[38px] w-[170px] rounded-[10px] border border-[#A8ADB7] bg-white px-4 text-[14px] text-[#111827] outline-none"
            />
          </div>
        </div>

        {!safeRange && (
          <div className="mb-6 inline-flex rounded-[10px] border border-[#f2b8b5] bg-[#fff1f0] px-4 py-2 text-[13px] text-[#c53030]">
            Khoảng ngày không hợp lệ. Vui lòng chọn lại ngày.
          </div>
        )}

        <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            value={String(stats.totalOrders)}
            label="Đơn hàng"
            bgClass="bg-[#5D75E7]"
          />
          <StatCard
            value={String(stats.totalCustomers)}
            label="Khách hàng"
            bgClass="bg-[#EC8A57]"
          />
          <StatCard
            value={formatCurrency(stats.totalRevenue)}
            label="Tổng doanh thu"
            bgClass="bg-[#42C3A2]"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard title="Doanh thu theo thời gian">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={revenueChartData}
                margin={{ top: 8, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid stroke="#E5E7EB" vertical />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#666" }}
                  axisLine={{ stroke: "#D7DCE2" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#666" }}
                  axisLine={false}
                  tickLine={false}
                  width={38}
                  allowDecimals={false}
                />
                <Tooltip
                  formatter={(value) => {
                    return [
                      `${formatCurrency(Number(value ?? 0))} triệu`,
                      "Doanh thu",
                    ] as [string, string];
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Line
                  type="linear"
                  dataKey="revenue"
                  name="Doanh thu"
                  stroke="#3EA0F4"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#3EA0F4" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Top sản phẩm bán chạy">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topToursData}
                margin={{ top: 8, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid stroke="#E5E7EB" vertical />
                <XAxis
                  dataKey="tourName"
                  tick={{ fontSize: 11, fill: "#666" }}
                  axisLine={{ stroke: "#D7DCE2" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#666" }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                  allowDecimals={false}
                />
                <Tooltip
                  formatter={(value) => {
                    return [`${Number(value ?? 0)}`, "Số lượng bán"] as [
                      string,
                      string,
                    ];
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar
                  dataKey="quantity"
                  name="Số lượng bán"
                  fill="#9CC7E4"
                  barSize={48}
                >
                  {topToursData.map((entry) => (
                    <Cell key={entry.tourName} fill="#9CC7E4" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="mt-12 flex items-center gap-2 text-[14px] text-[#8B93A3]">
          <span>2026</span>
          <Bell className="h-[14px] w-[14px]" />
          <span>Duy Tan University</span>
        </div>
      </div>
    </div>
  );
}
