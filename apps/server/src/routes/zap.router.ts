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

// delete zap
router.delete("/zap/:zapId", authMiddleware, zapController.deleteZap)

// delete zap run
router.delete("/zapRun/:zapRunId", authMiddleware, zapController.deleteZapRun)

export const zapRouter = router;