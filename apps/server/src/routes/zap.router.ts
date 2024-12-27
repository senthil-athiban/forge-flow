import { Router } from "express";
import { authMiddleware } from "../middlware.js";
import zapController from "../controller/zap.controller.js";
const router = Router();
//@ts-ignore
// submit zap endpoint
router.post("/", authMiddleware, zapController.createZap);
//@ts-ignore
// get all zaps
router.get("/", authMiddleware, zapController.getUserZaps)
//@ts-ignore
// get particular zap
router.get("/:zapId", authMiddleware, zapController.getUserZap)

export const zapRouter = router;