import { Router } from "express";
import { createRequest, getRequest, listMyRequests, listRequests, updateRequestStatus, } from "../controllers/request.controller";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.post("/", authorize("citizen"), createRequest);
router.get("/mine", authorize("citizen"), listMyRequests); 
router.get("/:id", getRequest);
router.get("/", authorize("admin"), listRequests);
router.post("/", authorize("citizen"), createRequest);
router.get("/mine", authorize("citizen"), listMyRequests); // keep above "/:id"
router.get("/:id", getRequest);
router.patch("/:id/status", authorize("admin"), updateRequestStatus);

export default router;