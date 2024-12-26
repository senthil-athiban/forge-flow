import { Router } from "express";
import { authMiddleware } from "../middlware";
import userController from "@/controller/user.controller";

const router = Router();

router.get("/verify", authMiddleware, userController.verifyUser);

export const userRouter = router;
