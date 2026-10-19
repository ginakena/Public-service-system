import rateLimit from "express-rate-limit";

const WINDOW_MS = 15 * 60 * 1000;

// General protection for the whole API
export const apiLimiter = rateLimit({
  windowMs: WINDOW_MS,
  limit: 300,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: " please try again later" },
});

// Stricter limit on login and register to slow down password guessing.
// Successful requests aren't counted, so normal users aren't affected.
export const authLimiter = rateLimit({
  windowMs: WINDOW_MS,
  limit: 20,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many attempts, please try again in 15 minutes" },
});