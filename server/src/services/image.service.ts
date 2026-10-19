import { cloudinary, cloudinaryEnabled } from "../config/cloudinary";
import { HttpError } from "../utils/httpError";

export async function uploadImage(buffer: Buffer): Promise<string> {
  if (!cloudinaryEnabled) throw new HttpError(503, "Image uploads are not configured");

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "service-requests",
        resource_type: "image",
        // Keep stored files small: cap the size and let Cloudinary pick quality and format
        transformation: [{ width: 1600, height: 1600, crop: "limit" }, { quality: "auto", fetch_format: "auto" }],
      },
      (err, result) => {
        if (err || !result) {
          return reject(
            err?.http_code === 400 ? new HttpError(400, "That file is not a valid image") : err ?? new Error("Upload failed")
          );
        }
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}