import type { Category, Status } from "./constants";
import type { DashboardStats, PaginatedRequests, ServiceRequest } from "../types";
import { api } from "./api";

export interface ListParams {
  status?: Status | "";
  category?: Category | "";
  q?: string;
  page?: number;
  limit?: number;
}

export const adminApi = {
  stats: () => api.get<DashboardStats>("/admin/stats"),

  listRequests: (params: ListParams) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") qs.set(key, String(value));
    });
    return api.get<PaginatedRequests>(`/requests?${qs.toString()}`);
  },

  updateStatus: (id: string, status: Status, note?: string) =>
    api.patch<{ request: ServiceRequest }>(`/requests/${id}/status`, { status, note }),
};