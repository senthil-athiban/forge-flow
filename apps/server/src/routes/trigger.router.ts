import { Router } from "express";
import { authMiddleware } from "../middlware.js";
import triggerController from "../controller/trigger.controller.js";

const router = Router();
//@ts-ignore
router.get("/", authMiddleware,  triggerController.getAllTriggers)

export const triggerRouter = router;