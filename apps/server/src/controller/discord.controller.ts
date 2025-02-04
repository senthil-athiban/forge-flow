import { asyncMiddleWare } from "@/config/asyncMiddleware";
import { CLIENT_URL } from "@/config/config";
import { discordClient, discordConfig } from "@/config/discord";
import { ApiError } from "@/config/error";

import userService from "@/services/user.service";
import { discordService } from "@repo/common";
import { Request, Response } from "express";

const addDiscord = asyncMiddleWare(async (req: Request, res: Response) => {
  const redirectUrl = await discordService.getRedirectUrl();
  res.status(200).json({ redirectUrl });
});

const oAuthCallback = asyncMiddleWare(async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    const guildId = req.query.guild_id as string;
    const state = req.query.state as string;
    if (!guildId) throw new ApiError(404, "Server id not found");

    await discordService.getClient().login(discordConfig.botToken);

    const guild = await discordService.getGuildById(guildId);
    const channels = await discordService.getGuildChannels(guildId);

    const { userId } = JSON.parse(atob(state));
    await discordService.storeDiscordMetadata(userId, guild, channels);
    
    res.redirect(`${CLIENT_URL}/zap/discord/success`);
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
});

const getUserChannels = asyncMiddleWare(async (req: Request, res: Response) => {
  const userId = req.userId;
  const user = await userService.getUser({
    where: { id: userId },
    select: { id: true, name: true },
  });

  if (!user) throw new ApiError(404, "No user was found");
  const channels = await discordService.getChannelsByUserId(user.id);
  res.status(200).send({ channels });
});

const sendDiscordNotification = asyncMiddleWare(
  async (req: Request, res: Response) => {
    const channelId = req.query.channelId as string;
    const guild = await discordService.getGuildByChannelId(channelId);
    if (!guild)
      throw new ApiError(404, "No server found for the given channelId");
  }
);

export default {
  addDiscord,
  oAuthCallback,
  sendDiscordNotification,
  getUserChannels,
};
