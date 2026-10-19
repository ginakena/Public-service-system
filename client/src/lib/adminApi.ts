import type { DashboardStats } from "../types";
import { api } from "./api";

export const adminApi = {
  stats: () => api.get<DashboardStats>("/admin/stats"),
};