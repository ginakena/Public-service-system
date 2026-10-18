import { z } from "zod";
import { CATEGORIES } from "../models/ServiceRequest";

export const createRequestSchema = z.object({
  category: z.enum(CATEGORIES, { message: `Category must be one of: ${CATEGORIES.join(", ")}` }),
  location: z.object({
    county: z.string().trim().min(2, "County is required"),
    area: z.string().trim().min(2, "Area is required"),
    address: z.string().trim().optional(),    
  }),
  description: z
    .string()
    .trim()
    .min(10, "Please describe the problem in at least 10 characters")
    .max(1000, "Description must be 1000 characters or less"),
});