import discordController from "../controller/discord.controller";
import { authMiddleware } from "../middlware";
import { Router } from "express";

const router = Router();

router.get("/add", discordController.addDiscord);
router.get("/callback", discordController.oAuthCallback);
router.get("/channels", authMiddleware, discordController.getUserChannels)
router.post("/send-message", discordController.sendDiscordNotification);

export const discordRouter = router;