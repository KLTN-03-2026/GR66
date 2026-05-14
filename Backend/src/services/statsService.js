import Booking from "../models/booking.js";
import Tour from "../models/Tour.js";
import TourService from "../models/tourService.js";

class StatsService {
  static async getStats({ fromDate, toDate }) {
    try {
      console.log("=== GET STATS ===");
      console.log("From:", fromDate, "To:", toDate);

      const from = new Date(fromDate);
      from.setHours(0, 0, 0, 0);
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);

      // Lấy booking theo điều kiện
      const finalBookings = await Booking.find({
        trangThaiThanhToan: "Đã thanh toán",
        ngaydat: { $gte: from, $lte: to }
      }).populate("tourId", "tenTour");

      console.log("Found bookings:", finalBookings.length);

      // 1. TÍNH DOANH THU THEO NGÀY - GỘP LẠI
      const revenueMap = new Map();

      for (const booking of finalBookings) {
        if (!booking.ngaydat) continue;
        
        const dateStr = booking.ngaydat.toISOString().split('T')[0];
        const revenue = booking.tongtien || 0;
        
        revenueMap.set(dateStr, (revenueMap.get(dateStr) || 0) + revenue);
      }

      const revenueByDate = [];
      for (const [date, revenue] of revenueMap) {
        revenueByDate.push({
          date: date,
          revenue: revenue,
          revenueMillions: Number((revenue / 1_000_000).toFixed(2)),
        });
      }
      revenueByDate.sort((a, b) => a.date.localeCompare(b.date));

      console.log("Grouped revenue by date:", revenueByDate);

      // 2. TÍNH TOP TOUR BÁN CHẠY
      const tourStatsMap = new Map();
      
      for (const booking of finalBookings) {
        const tourId = booking.tourId?._id?.toString();
        const tourName = booking.tourId?.tenTour || "Không rõ";
        const totalPeople = (booking.soluongnguoilon || 0) + (booking.soluongtreem || 0);
        
        if (!tourStatsMap.has(tourId)) {
          tourStatsMap.set(tourId, {
            tourId: tourId,
            tourName: tourName,
            totalPeople: 0,
            totalOrders: 0,
            totalRevenue: 0,
          });
        }
        
        const stats = tourStatsMap.get(tourId);
        stats.totalPeople += totalPeople;
        stats.totalOrders += 1;
        stats.totalRevenue += booking.tongtien || 0;
      }
      
      const topTours = Array.from(tourStatsMap.values())
        .sort((a, b) => b.totalPeople - a.totalPeople)
        .slice(0, 5);

      console.log("Top tours:", topTours);

      // 3. TÍNH THỐNG KÊ DỊCH VỤ
      let topServices = [];
      let revenueByService = [];

      if (finalBookings.length > 0) {
        const tourIds = [...new Set(
          finalBookings.map(b => b.tourId?._id?.toString()).filter(Boolean)
        )];
        
        const tourServices = await TourService.find({
          tourId: { $in: tourIds }
        }).populate("dichvuId", "tenDichVu");
        
        const serviceStatsMap = new Map();
        
        for (const service of tourServices) {
          const serviceName = service.tenDichVuApDung || 
                             service.dichvuId?.tenDichVu || 
                             "Không rõ";
          const serviceId = service.dichvuId?._id?.toString() || service._id.toString();
          
          if (!serviceStatsMap.has(serviceId)) {
            serviceStatsMap.set(serviceId, {
              serviceId: serviceId,
              serviceName: serviceName,
              totalTours: 0,
              totalRevenue: 0,
              giaNguoiLon: service.giaApDungNguoiLon || 0,
              giaTreEm: service.giaApDungTreEm || 0,
            });
          }
          
          const stats = serviceStatsMap.get(serviceId);
          stats.totalTours += 1;
          
          for (const booking of finalBookings) {
            if (booking.tourId?._id?.toString() === service.tourId?.toString()) {
              const adultCount = booking.soluongnguoilon || 0;
              const childCount = booking.soluongtreem || 0;
              const revenueFromService = (adultCount * stats.giaNguoiLon) + (childCount * stats.giaTreEm);
              stats.totalRevenue += revenueFromService;
            }
          }
        }
        
        topServices = Array.from(serviceStatsMap.values())
          .sort((a, b) => b.totalTours - a.totalTours)
          .slice(0, 5);
        
        revenueByService = Array.from(serviceStatsMap.values())
          .sort((a, b) => b.totalRevenue - a.totalRevenue)
          .map(s => ({
            serviceName: s.serviceName,
            revenue: s.totalRevenue,
            revenueMillions: Number((s.totalRevenue / 1_000_000).toFixed(2)),
            tourCount: s.totalTours
          }));
      }

      console.log("Top services:", topServices);

      // Tổng doanh thu
      const totalRevenue = finalBookings.reduce((sum, b) => sum + (b.tongtien || 0), 0);

      return {
        summary: {
          totalOrders: finalBookings.length,
          totalRevenue: totalRevenue,
          uniqueCustomers: new Set(finalBookings.map(b => b.userId?.toString()).filter(Boolean)).size,
          averageOrderValue: finalBookings.length > 0 ? Math.round(totalRevenue / finalBookings.length) : 0,
        },
        revenueByDate: revenueByDate,
        topTours: topTours,
        topServices: topServices,
        revenueByService: revenueByService,
        orderList: finalBookings.map(b => ({
          id: b._id,
          date: b.ngaydat?.toISOString().split('T')[0] || "N/A",
          customerName: b.userId?.hoten || "Khách hàng",
          tourName: b.tourId?.tenTour || "Không rõ",
          adults: b.soluongnguoilon || 0,
          children: b.soluongtreem || 0,
          quantity: (b.soluongnguoilon || 0) + (b.soluongtreem || 0),
          revenue: b.tongtien || 0,
        })),
      };
      
    } catch (error) {
      console.error("Service error:", error);
      throw error;
    }
  }
}

export default StatsService;