import discordController from "@/controller/discord.controller";
import { Router } from "express";

const router = Router();

router.get("/add", discordController.addDiscord);
router.get("/callback", discordController.oAuthCallback);
router.post("/send-message", discordController.sendDiscordNotification);

export const discordRouter = router;