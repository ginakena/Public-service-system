import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../config/db";
import { env } from "../config/env";
import { User } from "../models/user";

async function seedAdmin() {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD ");
    process.exit(1);
  }

  await connectDB();

  const existing = await User.findOne({ email: env.ADMIN_EMAIL.toLowerCase() });
  if (existing) {
    console.log("Admin already exists, nothing to do");
  } else {
    await User.create({
      name: "System Admin",
      email: env.ADMIN_EMAIL.toLowerCase(),
      passwordHash: await bcrypt.hash(env.ADMIN_PASSWORD, 12),
      nationalId: "00000000",
      phone: "0700000000",
      role: "admin",
    });
    console.log(`Admin created: ${env.ADMIN_EMAIL}`);
  }

  await mongoose.disconnect();
}

seedAdmin();