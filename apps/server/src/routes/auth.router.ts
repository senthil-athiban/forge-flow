import { Router } from "express";
import authController from "../controller/auth.controller";

const router = Router();

router.post("/signup", authController.register as any);
router.post("/signin", authController.login);
router.post("/verify-email", authController.verifyEmail);
router.post("/refresh-token", authController.refreshToken);

export const authRouter = router;