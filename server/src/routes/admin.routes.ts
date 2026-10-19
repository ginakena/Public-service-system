import { Router } from "express";
import { getStats } from "../controllers/admin.controller";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

// Everything under /api/admin is admin-only
router.use(authenticate, authorize("admin"));

router.get("/stats", getStats);

export default router;