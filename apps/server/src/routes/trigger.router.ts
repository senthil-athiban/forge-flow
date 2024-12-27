import { Router } from "express";
import { authMiddleware } from "../middlware";
import triggerController from "../controller/trigger.controller";

const router = Router();
//@ts-ignore
router.get("/", authMiddleware,  triggerController.getAllTriggers)

export const triggerRouter = router;