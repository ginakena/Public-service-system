import { z } from "zod";
import { CATEGORIES, STATUSES } from "../models/ServiceRequest";
import { env } from "../config/env";

const isOwnCloudinaryUrl = (url: string) =>
  url.startsWith(`https://res.cloudinary.com/${env.CLOUDINARY_CLOUD_NAME}/`);

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
      imageUrl: z
    .string()
    .url()
    .refine(isOwnCloudinaryUrl, "Image must be uploaded correctly and hosted on our server")
    .optional(),
});

export const listRequestsQuerySchema = z.object({
  status: z.enum(STATUSES).optional(),
  category: z.enum(CATEGORIES).optional(),
  q: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const updateStatusSchema = z.object({
  status: z.enum(STATUSES, { message: `Status must be one of: ${STATUSES.join(", ")}` }),
  note: z.string().trim().max(500, "Note must be 1000 characters or less").optional(),
});