import { config } from "dotenv";

config();

export const discordConfig = {
  clientId: process.env.DISCORD_CLIENT_ID!,
  clientSecret: process.env.DISCORD_CLIENT_SECRET!,
  botToken: process.env.DISCORD_BOT_TOKEN!,
  redirectUri: process.env.DISCORD_REDIRECT_URI!,
};
