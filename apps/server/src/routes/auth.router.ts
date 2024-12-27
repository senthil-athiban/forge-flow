import { Router } from "express";
import authController from "../controller/auth.controller.js";
import "../config/passport";

const router = Router();

// email and password auth
router.post("/signup", authController.register);
router.post("/signin", authController.login);
router.post("/verify-email", authController.verifyEmail);
router.get("/refresh-token", authController.refreshToken);
router.post("/forgot-password", authController.forgotPassword);
router.get("/reset-password", authController.resetPassword);

// google oAuth
router.get("/google", authController.googleAuth);
router.get("/google/callback", authController.googleAuthCallback);
router.get("/google/success", authController.googleAuthSuccess);
router.get("/google/failure", authController.googleAuthFailure);

// github oAuth
router.get("/github", authController.githubAuth);
router.get("/github/callback", authController.githubAuthCallback);
router.get("/github/success", authController.githubAuthSuccess);
router.get("/github/failure", authController.githubAuthFailure);

export const authRouter = router;
