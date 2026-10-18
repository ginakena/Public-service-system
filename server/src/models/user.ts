import { InferSchemaType, Schema, model } from "mongoose";

export const ROLES = ["citizen", "officer", "admin"] as const;
export type Role = (typeof ROLES)[number];

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    nationalId: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, required: true, trim: true },
    role: { type: String, enum: ROLES, default: "citizen" },
    // department: { type: String, trim: true }, 
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    const out = ret as Record<string, unknown>;
    delete out.passwordHash;
    delete out.__v;
    return out;
  },
});

export type IUser = InferSchemaType<typeof userSchema>;
export const User = model("User", userSchema);