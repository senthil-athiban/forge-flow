import { Router } from "express";
import { authMiddleware } from "../middlware.js";
import userController from "../controller/user.controller.js";

const router = Router();

//@ts-ignore
router.get("/verify", authMiddleware, userController.verifyUser);

export const userRouter = router;
