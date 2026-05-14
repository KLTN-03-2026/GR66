import express from "express";
import StatsController from "../controllers/statsController.js";

const router = express.Router();

// GET /api/stats?fromDate=2024-03-01&toDate=2024-03-31
router.get("/", StatsController.getStats);

// Optional: Add endpoint for quick stats (last 30 days)
router.get("/recent", async (req, res) => {
  const toDate = new Date().toISOString().split('T')[0];
  const fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  req.query = { fromDate, toDate };
  return StatsController.getStats(req, res);
});

export default router;