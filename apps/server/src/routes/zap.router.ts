import { Router } from "express";
import { authMiddleware } from "../middlware";
import zapController from "../controller/zap.controller";
const router = Router();

// submit zap endpoint
router.post("/create", authMiddleware, zapController.createZap);

// get all zaps
router.get("/", authMiddleware, zapController.getUserZaps)

// get particular zap
router.get("/:zapId", authMiddleware, zapController.getUserZap)

// test zapRun
router.post("/zapRun/test", authMiddleware,zapController.testZapRun)

export const zapRouter = router;