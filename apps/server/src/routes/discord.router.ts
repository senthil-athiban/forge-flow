import discordController from "@/controller/discord.controller";
import { Router } from "express";

const router = Router();

router.get("/add", discordController.addDiscord);
// router.get("/callback", );
// router.post("/select-channel", );
// router.post("/send-message", );
export const discordRouter = router;