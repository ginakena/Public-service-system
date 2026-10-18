import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name is too short"),
  email: z.string().trim().toLowerCase().email("Invalid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Za-z]/, "Password must contain a letter")
    .regex(/\d/, "Password must contain a number"),
  nationalId: z.string().trim().regex(/^\d{7,8}$/, "Invalid national ID"),
  phone: z
    .string()
    .trim()
    .regex(/^(?:\+254|0)[17]\d{8}$/, "Use a valid Kenyan number, e.g. 0712345678"),
});

export const loginSchema = z.object({
  identifier: z.string().trim().toLowerCase().min(1, "Email or ID number is required"),
  password: z.string().min(1, "Password is required"),
});