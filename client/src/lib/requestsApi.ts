import type { ServiceRequest } from "../types";
import { api } from "./api";

export const requestsApi = {
  listMine: () => api.get<{ requests: ServiceRequest[] }>("/requests/mine"),
  get: (id: string) => api.get<{ request: ServiceRequest }>(`/requests/${id}`),
};