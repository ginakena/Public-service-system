import { InferSchemaType, Schema, model } from "mongoose";

export const CATEGORIES = ["streetlight", "water", "garbage", "roads", "sewage","insecurity", "other"] as const;
export const STATUSES = ["pending", "in_progress", "resolved"] as const;

export type Category = (typeof CATEGORIES)[number];
export type Status = (typeof STATUSES)[number];

const historySchema = new Schema(
  {
    status: { type: String, enum: STATUSES, required: true },
    by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    note: { type: String, trim: true },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const locationSchema = new Schema(
  {
    county: { type: String, required: true, trim: true },
    area: { type: String, required: true, trim: true },
    address: { type: String, trim: true },   
  },
  { _id: false }
);

const serviceRequestSchema = new Schema(
  {
    refNo: { type: String, required: true, unique: true },
    citizen: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    category: { type: String, enum: CATEGORIES, required: true },
    location: { type: locationSchema, required: true },
    description: { type: String, required: true, trim: true },
    imageUrl: { type: String },
    status: { type: String, enum: STATUSES, default: "pending", index: true },
    history: { type: [historySchema], default: [] },
  },
  { timestamps: true }
);

serviceRequestSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete (ret as Record<string, unknown>).__v;
    return ret;
  },
});

export type IServiceRequest = InferSchemaType<typeof serviceRequestSchema>;
export const ServiceRequest = model("ServiceRequest", serviceRequestSchema);