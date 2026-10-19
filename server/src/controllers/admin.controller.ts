import { getDashboardStats } from "../services/stats.service";
import { asyncHandler } from "../utils/asyncHandler";

export const getStats = asyncHandler(async (_req, res) => {
  res.json(await getDashboardStats());
});