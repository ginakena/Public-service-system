import type { CreateRequestInput, ServiceRequest } from "../types";
import { api } from "./api";

export const requestsApi = {
  listMine: () => api.get<{ requests: ServiceRequest[] }>("/requests/mine"),
  get: (id: string) => api.get<{ request: ServiceRequest }>(`/requests/${id}`),
  create: (input: CreateRequestInput) => api.post<{ request: ServiceRequest }>("/requests", input),
  uploadImage: (file: File) => {
    const form = new FormData();
    form.append("image", file);
    return api.post<{ imageUrl: string }>("/uploads/image", form);
  },
};