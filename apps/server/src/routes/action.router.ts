import { Router } from "express";
import { authMiddleware } from "../middlware.js";
import actionController from "../controller/action.controller.js";

const router = Router();
//@ts-ignore
router.get("/", authMiddleware,  actionController.getAllActions)

export const actionRouter = router;