import { Router } from "express";
import { authMiddleware } from "../middlware";
import actionController from "@/controller/action.controller";

const router = Router();
router.get("/", authMiddleware,  actionController.getAllActions)

export const actionRouter = router;