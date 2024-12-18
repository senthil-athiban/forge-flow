import { Router } from "express";
import authController from "../controller/auth.controller";

const router = Router();

router.post("/signup", authController.register as any);
router.post("/signin", authController.login);
router.post("/verify-email", authController.verifyEmail);
router.post("/refresh-token", authController.refreshToken);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword)

export const authRouter = router;