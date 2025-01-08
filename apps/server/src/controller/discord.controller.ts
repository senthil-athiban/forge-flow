import { asyncMiddleWare } from "@/config/asyncMiddleware";
import discordService from "@/services/discord.service";
import { Request, Response } from "express";

const addDiscord = asyncMiddleWare(async (req: Request, res: Response) => {
    const redirectUrl = await discordService.getRedirectUrl();
    res.redirect(redirectUrl);
})

export default { addDiscord };