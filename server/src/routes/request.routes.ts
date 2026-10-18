import { Router } from "express";
import { createRequest, getRequest, listMyRequests } from "../controllers/request.controller";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.post("/", authorize("citizen"), createRequest);
router.get("/mine", authorize("citizen"), listMyRequests); 
router.get("/:id", getRequest);

export default router;