import multer from "multer";
import { HttpError } from "../utils/httpError";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) cb(null, true);
    else cb(new HttpError(400, "Only JPEG, PNG or WebP images are allowed"));
  },
}).single("image");