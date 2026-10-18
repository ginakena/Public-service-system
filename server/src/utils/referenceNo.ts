import { Counter } from "../models/Counter";

export async function nextRefNo(): Promise<string> {
  const year = new Date().getFullYear();
  const counter = await Counter.findByIdAndUpdate(
    `request-${year}`,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  if (!counter) throw new Error("Failed to generate reference number");
  return `SR-${year}-${String(counter.seq).padStart(6, "0")}`;
}