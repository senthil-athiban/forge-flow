// TODO: common discordclient
import { Client, GatewayIntentBits } from "discord.js";

export const discordClient = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

export const discordConfig = {
  clientId: process.env.DISCORD_CLIENT_ID!,
  clientSecret: process.env.DISCORD_CLIENT_SECRET!,
  botToken: process.env.DISCORD_BOT_TOKEN!,
  redirectUri: process.env.DISCORD_REDIRECT_URI!,
};

export const sendDiscordNotification = async (
  guildId: string,
  channelId: string,
  message: string
) => {
  console.log("message : ", message);
  try {
    await discordClient.login(discordConfig.botToken);
    const guild = await discordClient?.guilds.fetch(guildId);
    const channel = await guild.channels.fetch(channelId);
    if (!channel || !channel.isTextBased()) {
      throw new Error("Channel not found or not text-based");
    }
    const resdiscord = await channel.send(message);
    return true;
  } catch (error) {
    console.error("Error sending Discord notification:", error);
    return false;
  }
};
