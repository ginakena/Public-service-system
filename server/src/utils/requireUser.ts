import { Request } from "express";
import { HydratedDocument } from "mongoose";
import { IUser } from "../models/user";
import { HttpError } from "./httpError";

export function requireUser(req: Request): HydratedDocument<IUser> {
  if (!req.user) throw new HttpError(401, "Authentication required");
  return req.user;
}