import { uploadImage } from "../services/image.service";
import { HttpError } from "../utils/httpError";
import { asyncHandler } from "../utils/asyncHandler";

export const uploadRequestImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new HttpError(400, "No image provided. Send the file in a form field named 'image'");
  }
  const imageUrl = await uploadImage(req.file.buffer);
  res.status(201).json({ imageUrl });
});