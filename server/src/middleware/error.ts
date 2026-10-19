import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import multer from "multer";
import { HttpError } from "../utils/httpError";

export function notFound(req: Request, res: Response) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      errors: err.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
    });
    return;
  }

  if (err instanceof multer.MulterError) {
  const message =
    err.code === "LIMIT_FILE_SIZE"
      ? "Image must be 5 MB or smaller"
      : err.code === "LIMIT_UNEXPECTED_FILE"
        ? "Send the file in a form field named 'image'"
        : err.message;
  res.status(400).json({ message });
  return;
}

  if (err instanceof HttpError) {
    res.status(err.status).json({ message: err.message });
    return;
  }

  if (typeof err === "object" && err !== null && "code" in err && err.code === 11000) {
    res.status(409).json({ message: "Duplicate value" });
    return;
  }

  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}