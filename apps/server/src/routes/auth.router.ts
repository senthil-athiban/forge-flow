import { Router } from "express";
import authController from "../controller/auth.controller";


const router = Router();
router.post("/signup", authController.register as any);
router.post("/verify-email", authController.verifyEmail);
router.post("/signin", authController.login);

export const authRouter = router;