import { asyncMiddleWare } from "@/config/asyncMiddleware";
import { discordClient, discordConfig } from "@/config/discord";
import { ApiError } from "@/config/error";
import discordService from "@/services/discord.service";
import { Request, Response } from "express";

const addDiscord = asyncMiddleWare(async (req: Request, res: Response) => {
  const redirectUrl = await discordService.getRedirectUrl();
  res.redirect(redirectUrl);
});

const oAuthCallback = asyncMiddleWare(async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    const guildId = req.query.guild_id as string;
    if (!guildId) throw new ApiError(404, "Server id not found");

    await discordClient.login(discordConfig.botToken);
    const channels = await discordService.getGuildChannels(guildId);
    res.status(200).send(channels);
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
});

const sendDiscordNotification = asyncMiddleWare(async (req: Request, res: Response) => {
    const channelId = req.query.channelId as string;
    const guild = await discordService.getGuild(channelId);
    if(!guild) throw new ApiError(404, "No server found for the given channelId");

})
export default { addDiscord, oAuthCallback, sendDiscordNotification };
