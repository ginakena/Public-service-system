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