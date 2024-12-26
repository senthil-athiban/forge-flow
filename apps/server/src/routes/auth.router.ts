import { Router } from "express";
import authController from "../controller/auth.controller";
import "../config/passport";

const router = Router();

// email and password auth
router.post("/signup", authController.register as any);
router.post("/signin", authController.login as any);
router.post("/verify-email", authController.verifyEmail as any);
router.get("/refresh-token", authController.refreshToken as any);
router.post("/forgot-password", authController.forgotPassword as any);
router.get("/reset-password", authController.resetPassword);

// google oAuth
router.get("/google", authController.googleAuth);
router.get("/google/callback", authController.googleAuthCallback);
router.get("/google/success", authController.googleAuthSuccess as any);
router.get("/google/failure", authController.googleAuthFailure);

// github oAuth
router.get("/github", authController.githubAuth);
router.get("/github/callback", authController.githubAuthCallback);
router.get("/github/success", authController.githubAuthSuccess as any);
router.get("/github/failure", authController.githubAuthFailure);

export const authRouter = router;
