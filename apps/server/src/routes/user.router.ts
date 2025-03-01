import { Router } from "express";
import { authMiddleware } from "../middlware";
import userController from "../controller/user.controller";

const router = Router();

router.get("/me", authMiddleware, userController.getUser);

export const userRouter = router;
