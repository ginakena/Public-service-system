import type { Category, Status } from "../lib/constants";
export type Role = "citizen" | "admin";

export interface User {
  _id: string;
  name: string;
  email: string;
  nationalId: string;
  phone: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  nationalId: string;
  phone: string;
  password: string;
}

export interface RequestLocation {
  county: string;
  area: string;
  address?: string;
  lat?: number;
  lng?: number;
}

export interface HistoryEntry {
  status: Status;
  by: string | { _id: string; name: string; role: Role };
  note?: string;
  at: string;
}

export interface ServiceRequest {
  _id: string;
  refNo: string;
  citizen: string | { _id: string; name: string; email: string; phone: string };
  category: Category;
  location: RequestLocation;
  description: string;
  imageUrl?: string;
  status: Status;
  history: HistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequestInput {
  category: Category;
  location: { county: string; area: string; address?: string };
  description: string;
  imageUrl?: string;
}

export interface DashboardStats {
  totals: {
    total: number;
    open: number;
    pending: number;
    inProgress: number;
    resolved: number;
    resolutionRate: number;
  };
  byCategory: { category: Category; total: number; open: number; resolved: number }[];
  daily: { date: string; count: number }[];
  avgResolutionHours: number | null;
}