import { Router } from "express";
import { authMiddleware } from "../middlware";
import zapController from "../controller/zap.controller";
const router = Router();

// submit zap endpoint
router.post("/", authMiddleware, zapController.createZap);

// get all zaps
router.get("/", authMiddleware, zapController.getUserZaps)

// get particular zap
router.get("/:zapId", authMiddleware, zapController.getUserZap)

export const zapRouter = router;