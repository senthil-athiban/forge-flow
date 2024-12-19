import { Router } from "express";
import authController from "../controller/auth.controller";

const router = Router();

router.post("/signup", authController.register as any);
router.post("/signin", authController.login);
router.post("/verify-email", authController.verifyEmail);
router.get("/refresh-token", authController.refreshToken);
router.post("/forgot-password", authController.forgotPassword);
router.get("/reset-password", authController.resetPassword);
// router.get("/google", authController.googleAuth);
// router.get("/google/callback", authController.googleAuthCallback);

router.get("/github", authController.githubAuth);
router.get("/github/callback", authController.githubAuthCallback);

export const authRouter = router;