import { NextFunction, Request, Response } from "express";

export function notFound(req: Request, res: Response) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status ?? 500;
  res.status(status).json({
    message: err.message || "Internal server error",
  });
}