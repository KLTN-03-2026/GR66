// controllers/statsController.js
import StatsService from "../services/statsService.js";

class StatsController {
  static async getStats(req, res) {
    try {
      const { fromDate, toDate } = req.query;
      
      console.log("=== Controller received ===");
      console.log("fromDate:", fromDate);
      console.log("toDate:", toDate);

      if (!fromDate || !toDate) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp fromDate và toDate",
        });
      }

      const data = await StatsService.getStats({ fromDate, toDate });
      
      console.log("=== Controller returning ===");
      console.log("Data:", JSON.stringify(data.summary, null, 2));
      
      return res.status(200).json({
        success: true,
        message: "Lấy thống kê thành công",
        data,
      });
    } catch (error) {
      console.error("Controller error:", error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default StatsController;