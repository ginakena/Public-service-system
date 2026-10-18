import { isValidObjectId } from "mongoose";
import { ServiceRequest } from "../models/ServiceRequest";
import { HttpError } from "../utils/httpError";
import { asyncHandler } from "../utils/asyncHandler";
import { nextRefNo } from "../utils/referenceNo";
import { requireUser } from "../utils/requireUser";
import { createRequestSchema } from "../validators/request.validators";

export const createRequest = asyncHandler(async (req, res) => {
  const user = requireUser(req);
  const data = createRequestSchema.parse(req.body);

  const request = await ServiceRequest.create({
    ...data,
    refNo: await nextRefNo(),
    citizen: user.id,
    status: "pending",
    history: [{ status: "pending", by: user.id, note: "Request submitted" }],
  });

  res.status(201).json({ request });
});

export const listMyRequests = asyncHandler(async (req, res) => {
  const user = requireUser(req);
  const requests = await ServiceRequest.find({ citizen: user.id }).sort({ createdAt: -1 });
  res.json({ requests });
});

export const getRequest = asyncHandler(async (req, res) => {
  const user = requireUser(req);
  const id = String(req.params.id);

  if (!isValidObjectId(id)) throw new HttpError(404, "Request not found");

  const request = await ServiceRequest.findById(id);
  const isOwner = request?.citizen.toString() === user.id;

    if (!request || (!isOwner && user.role !== "admin")) {
    throw new HttpError(404, "Request not found");
  }

  await request.populate([
    { path: "citizen", select: "name email phone nationalId" },
    { path: "history.by", select: "name role" },
  ]);

  res.json({ request });
});