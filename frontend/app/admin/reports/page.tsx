"use client";

import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Bell, Loader2, AlertCircle, RefreshCw, Calendar, TrendingUp, Users, ShoppingBag } from "lucide-react";

// Types
type RevenueByDate = {
  date: string;
  revenue: number;
  revenueMillions: number;
};

type OrderRecord = {
  id: string;
  date: string;
  customerName: string;
  customerEmail?: string;
  tourName: string;
  adults: number;
  children: number;
  quantity: number;
  revenue: number;
};

type RevenueByService = {
  serviceName: string;
  revenue: number;
  revenueMillions: number;
  tourCount: number;
};

type TopTour = {
  tourId: string;
  tourName: string;
  totalPeople: number;
  totalOrders: number;
  totalRevenue: number;
};

type TopService = {
  serviceId: string;
  serviceName: string;
  totalTours: number;
  totalRevenue: number;
  giaNguoiLon: number;
  giaTreEm: number;
};

type StatsData = {
  summary: {
    totalOrders: number;
    totalRevenue: number;
    uniqueCustomers: number;
    averageOrderValue: number;
  };
  revenueByDate: RevenueByDate[];
  topTours: TopTour[];
  topServices: TopService[];
  revenueByService: RevenueByService[];
  orderList: OrderRecord[];
  details?: {
    fromDate: string;
    toDate: string;
    totalBookingsFound: number;
  };
};

// Helpers - DÙNG URL CỐNG CHO STATS API
const STATS_API_URL = "http://localhost:3001/api/stats";

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

function formatCompactNumber(value: number) {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

function getTodayStr() {
  return "2026-12-31";
}

function getDefaultFrom() {
  return "2026-01-01";
}

// Sub-components
function StatCard({ 
  value, 
  label, 
  icon: Icon, 
  color, 
  loading 
}: { 
  value: string; 
  label: string; 
  icon: React.ElementType; 
  color: string; 
  loading: boolean;
}) {
  return (
    <div className="rounded-[16px] bg-white p-6 shadow-sm border border-[#E5E7EB] transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          {loading ? (
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          ) : (
            <div className="text-[32px] font-bold" style={{ color: color }}>{value}</div>
          )}
          <div className="mt-2 text-[14px] font-medium text-[#6B7280]">{label}</div>
        </div>
        <div className="rounded-full p-3" style={{ backgroundColor: `${color}20` }}>
          <Icon className="h-6 w-6" style={{ color: color }} />
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[16px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
      <h3 className="mb-5 text-[18px] font-semibold text-[#111827]">{title}</h3>
      <div className="h-[300px] w-full">{children}</div>
    </div>
  );
}

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-white p-3 shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-900">{label}</p>
        <p className="text-sm text-blue-600">
          {payload[0].name}: {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

// Main Page
export default function StatsPage() {
  const [fromDate, setFromDate] = useState(getDefaultFrom());
  const [toDate, setToDate] = useState(getTodayStr());
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const isRangeValid = useMemo(() => {
    if (!fromDate || !toDate) return false;
    return fromDate <= toDate;
  }, [fromDate, toDate]);

  const fetchStats = useCallback(async () => {
    if (!isRangeValid) {
      setError("Khoảng ngày không hợp lệ");
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const url = `${STATS_API_URL}?fromDate=${fromDate}&toDate=${toDate}`;
      console.log("Fetching stats from:", url);
      
      const res = await fetch(url, {
        signal: abortControllerRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const json = await res.json();
      
      console.log("Response:", json);
      
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Lỗi không xác định");
      }
      
      setData(json.data);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('Fetch aborted');
        return;
      }
      console.error("Fetch error:", err);
      setError(err instanceof Error ? err.message : "Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, isRangeValid]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isRangeValid) {
        fetchStats();
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fromDate, toDate, isRangeValid, fetchStats]);

  const revenueChartData = useMemo(() => {
    if (!data?.revenueByDate) return [];
    return data.revenueByDate.map(item => ({
      ...item,
      displayDate: new Date(item.date).toLocaleDateString('vi-VN'),
    }));
  }, [data?.revenueByDate]);

  const topToursData = useMemo(() => {
    if (!data?.topTours) return [];
    return data.topTours.map(t => ({
      tourName: t.tourName.length > 20 ? t.tourName.substring(0, 20) + '...' : t.tourName,
      quantity: t.totalPeople,
      fullName: t.tourName,
    }));
  }, [data?.topTours]);

  const topServicesData = useMemo(() => {
    if (!data?.topServices) return [];
    return data.topServices.map(s => ({
      serviceName: s.serviceName.length > 20 ? s.serviceName.substring(0, 20) + '...' : s.serviceName,
      totalTours: s.totalTours,
      fullName: s.serviceName,
    }));
  }, [data?.topServices]);

  const revenueByServiceData = useMemo(() => {
    if (!data?.revenueByService) return [];
    return data.revenueByService.map(s => ({
      name: s.serviceName.length > 15 ? s.serviceName.substring(0, 15) + '...' : s.serviceName,
      revenue: s.revenue,
      value: s.revenue,
    }));
  }, [data?.revenueByService]);

  const summary = data?.summary;

  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-[32px] font-bold text-[#111827] md:text-[36px]">
            Báo cáo thống kê
          </h1>
          <p className="mt-2 text-[14px] text-[#6B7280]">
            Tổng quan doanh thu và đơn hàng theo thời gian
          </p>
        </div>

        <div className="mb-8 rounded-[16px] bg-white p-6 shadow-sm border border-[#E5E7EB]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6">
            <div className="flex-1">
              <label className="mb-2 block text-[14px] font-medium text-[#374151]">
                Từ ngày
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-[42px] w-full rounded-[10px] border border-[#D1D5DB] bg-white px-4 text-[14px] text-[#111827] outline-none focus:border-[#5D75E7] focus:ring-1 focus:ring-[#5D75E7]"
              />
            </div>

            <div className="flex-1">
              <label className="mb-2 block text-[14px] font-medium text-[#374151]">
                Đến ngày
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="h-[42px] w-full rounded-[10px] border border-[#D1D5DB] bg-white px-4 text-[14px] text-[#111827] outline-none focus:border-[#5D75E7] focus:ring-1 focus:ring-[#5D75E7]"
              />
            </div>

            <button
              onClick={fetchStats}
              disabled={loading || !isRangeValid}
              className="flex h-[42px] items-center gap-2 rounded-[10px] bg-[#5D75E7] px-6 text-[14px] font-medium text-white transition-all hover:bg-[#4a5fc4] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Đang tải..." : "Làm mới"}
            </button>
          </div>

          {!isRangeValid && (
            <div className="mt-4 flex items-center gap-2 rounded-[10px] bg-[#FEF3F2] px-4 py-2 text-[13px] text-[#DC2626]">
              <AlertCircle className="h-4 w-4" />
              Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-[10px] bg-[#FEF3F2] px-4 py-2 text-[13px] text-[#DC2626]">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            value={loading ? "---" : String(summary?.totalOrders ?? 0)}
            label="Tổng đơn hàng"
            icon={ShoppingBag}
            color="#5D75E7"
            loading={loading}
          />
          <StatCard
            value={loading ? "---" : String(summary?.uniqueCustomers ?? 0)}
            label="Khách hàng duy nhất"
            icon={Users}
            color="#EC8A57"
            loading={loading}
          />
          <StatCard
            value={loading ? "---" : formatCurrency(summary?.totalRevenue ?? 0)}
            label="Tổng doanh thu"
            icon={TrendingUp}
            color="#42C3A2"
            loading={loading}
          />
          <StatCard
            value={loading ? "---" : formatCurrency(summary?.averageOrderValue ?? 0)}
            label="Giá trị đơn hàng trung bình"
            icon={Calendar}
            color="#A78BFA"
            loading={loading}
          />
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Chart 1: Doanh thu theo thời gian */}
          <ChartCard title="Doanh thu theo thời gian">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="displayDate" tick={{ fontSize: 11, fill: "#6B7280" }} interval="preserveStartEnd" angle={-45} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} tickFormatter={(value) => formatCompactNumber(value)} width={60} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="revenue" name="Doanh thu" stroke="#5D75E7" strokeWidth={2} dot={{ r: 3, fill: "#5D75E7" }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Chart 2: Top tour bán chạy nhất */}
          <ChartCard title="Top tour bán chạy nhất">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topToursData} layout="vertical" margin={{ top: 10, right: 30, left: 80, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#6B7280" }} />
                <YAxis type="category" dataKey="tourName" tick={{ fontSize: 11, fill: "#6B7280" }} width={100} />
                <Tooltip
                  formatter={(value) => [`${value} người`, "Số lượng khách"]}
                  labelFormatter={(label) => `Tour: ${label}`}
                />
                <Legend />
                <Bar dataKey="quantity" name="Số lượng khách" fill="#9CC7E4" radius={[0, 4, 4, 0]}>
                  {topToursData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(210, ${60 + index * 5}%, 70%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Chart 3: Top dịch vụ được sử dụng nhiều nhất */}
          <ChartCard title="Top dịch vụ được sử dụng nhiều nhất">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topServicesData} layout="vertical" margin={{ top: 10, right: 30, left: 100, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#6B7280" }} />
                <YAxis type="category" dataKey="serviceName" tick={{ fontSize: 11, fill: "#6B7280" }} width={120} />
                <Tooltip
                  formatter={(value) => [`${value} người`, "Số lượng khách"]}
                  labelFormatter={(label) => `Tour: ${label}`}
                />
                <Legend />
                <Bar dataKey="totalTours" name="Số tour sử dụng" fill="#F59E0B" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Chart 4: Doanh thu theo dịch vụ */}
          <ChartCard title="Doanh thu theo dịch vụ">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueByServiceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => {
                    if (percent === undefined) return name;
                    return `${name}: ${(percent * 100).toFixed(0)}%`;
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {revenueByServiceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {!loading && !error && data && data.orderList.length === 0 && (
          <div className="mb-8 rounded-[16px] border border-dashed border-[#CBD5E1] bg-white py-16 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-[16px] font-medium text-[#374151]">Không có dữ liệu</p>
            <p className="mt-1 text-[14px] text-[#6B7280]">Không tìm thấy đơn hàng nào trong khoảng thời gian này</p>
          </div>
        )}

        {!loading && data && data.orderList.length > 0 && (
          <div className="mb-8 rounded-[16px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-[18px] font-semibold text-[#111827]">Chi tiết đơn hàng</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Doanh thu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {data.orderList.slice(0, 10).map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{order.date}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order.customerName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order.tourName}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">{order.quantity}</td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-green-600">{formatCurrency(order.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.orderList.length > 10 && (
                <div className="mt-4 text-center text-sm text-gray-500">Hiển thị 10 trên {data.orderList.length} đơn hàng</div>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between border-t border-[#E5E7EB] pt-6 text-[13px] text-[#9CA3AF]">
          <div className="flex items-center gap-2">
            <Bell className="h-3 w-3" />
            <span>Duy Tan University - Tourism Management System</span>
          </div>
          <div>© 2026</div>
        </div>
      </div>
    </div>
  );
}