import bcrypt from "bcryptjs";
import { User } from "../models/user";
import { HttpError } from "../utils/httpError";
import { asyncHandler } from "../utils/asyncHandler";
import { signToken } from "../utils/jwt";
import { loginSchema, registerSchema } from "../validators/auth.validators";

export const register = asyncHandler(async (req, res) => {
  const data = registerSchema.parse(req.body);

  const exists = await User.findOne({
    $or: [
      { email: data.email },
      { nationalId: data.nationalId },
    ],
  });

  if (exists) {
    throw new HttpError(
      409,
      "An account with this email or national ID already exists"
    );
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await User.create({
    name: data.name,
    email: data.email,
    nationalId: data.nationalId,
    phone: data.phone,
    passwordHash,
    role: "citizen", // Never taken from the request body
  });

  const token = signToken({
    sub: user.id,
    role: user.role,
  });

  res.status(201).json({ user, token });
});

export const login = asyncHandler(async (req, res) => {
  const { identifier, password } = loginSchema.parse(req.body);

  const user = await User.findOne({
    $or: [
      { email: identifier },
      { nationalId: identifier },
    ],
  }).select("+passwordHash");

  const valid = user
    ? await bcrypt.compare(password, user.passwordHash)
    : false;

  if (!user || !valid) {
    throw new HttpError(
      401,
      "Invalid email/national ID or password"
    );
  }

  const token = signToken({
    sub: user.id,
    role: user.role,
  });

  res.json({ user, token });
});
