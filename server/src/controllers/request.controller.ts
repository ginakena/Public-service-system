import { isValidObjectId } from "mongoose";
import { ServiceRequest } from "../models/ServiceRequest";
import { HttpError } from "../utils/httpError";
import { asyncHandler } from "../utils/asyncHandler";
import { nextRefNo } from "../utils/referenceNo";
import { requireUser } from "../utils/requireUser";
import { createRequestSchema } from "../validators/request.validators";
import { escapeRegex } from "../utils/escapeRegex";
import { canTransition } from "../utils/statusFlow";
import { updateStatusSchema } from "../validators/request.validators";
import { allowedNext } from "../utils/statusFlow";
import { listRequestsQuerySchema } from "../validators/request.validators";
import { Status } from "../models/ServiceRequest";

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

export const listRequests = asyncHandler(async (req, res) => {
  const { status, category, q, page, limit } = listRequestsQuerySchema.parse(req.query);

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (q) {
    const pattern = new RegExp(escapeRegex(q), "i");
    filter.$or = [{ refNo: pattern }, { "location.area": pattern }, { "location.county": pattern }];
  }

  const [requests, total] = await Promise.all([
    ServiceRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("citizen", "name email phone"),
    ServiceRequest.countDocuments(filter),
  ]);

  res.json({
    requests,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

export const updateRequestStatus = asyncHandler(async (req, res) => {
  const admin = requireUser(req);
  const id = String(req.params.id);
  if (!isValidObjectId(id)) throw new HttpError(404, "Request not found");

  const { status, note } = updateStatusSchema.parse(req.body);

  const request = await ServiceRequest.findById(id);
  if (!request) throw new HttpError(404, "Request not found");

  const current = request.status as Status;
  if (!canTransition(current, status)) {
    const next = allowedNext(current);
    throw new HttpError(
      409,
      next.length
        ? `Cannot change status from ${current} to ${status}. Allowed next status: ${next.join(", ")}`
        : `Request is already ${current} and cannot be changed`
    );
  }

  request.status = status;
  request.history.push({ status, by: admin._id, note, at: new Date() });
  await request.save();

  await request.populate([
    { path: "citizen", select: "name email phone" },
    { path: "history.by", select: "name role" },
  ]);

  res.json({ request });
});