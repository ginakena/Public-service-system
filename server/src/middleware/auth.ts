import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Role, User } from "../models/user";
import { HttpError } from "../utils/httpError";
import { asyncHandler } from "../utils/asyncHandler";
import { TokenPayload } from "../utils/jwt";

export const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw new HttpError(401, "Authentication required");
  }

  let payload: TokenPayload;
  try {
    payload = jwt.verify(header.slice(7), env.JWT_SECRET) as unknown as TokenPayload;
  } catch {
    throw new HttpError(401, "Invalid or expired token");
  }

  // Load the user so deleted accounts and role changes take effect immediately
  const user = await User.findById(payload.sub);
  if (!user) throw new HttpError(401, "Account no longer exists");

  req.user = user;
  next();
});

export const authorize =
  (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new HttpError(401, "Authentication required"));
    if (!roles.includes(req.user.role as Role)) {
      return next(new HttpError(403, "You do not have permission to do this"));
    }
    next();
  };