import { Router } from "express";
import { uploadRequestImage } from "../controllers/upload.controller";
import { authenticate, authorize } from "../middleware/auth";
import { imageUpload } from "../middleware/upload";

const router = Router();

// Auth runs first so unauthenticated users never get to upload anything
router.post("/image", authenticate, authorize("citizen"), imageUpload, uploadRequestImage);

export default router;