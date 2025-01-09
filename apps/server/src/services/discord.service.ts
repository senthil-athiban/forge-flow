import { DISCORD_CLIENT_ID, DISCORD_REDIRECT_URI } from "@/config/config";
import { discordClient, discordConfig } from "@/config/discord";
import { ApiError } from "@/config/error";
import { prismaClient } from "@/db";

const getRedirectUrl = async () => {
  const redirectUrl = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&permissions=2048&response_type=code&redirect_uri=${DISCORD_REDIRECT_URI}&integration_type=0&scope=guilds+bot`;
  return redirectUrl;
};

const getGuildChannels = async (guildId: string) => {
  try {
    const isInGuild = discordClient.guilds.cache.has(guildId);
    if (!isInGuild) {
      throw new ApiError(400, `Bot is not in server ${guildId}`);
    }

    const guild = await discordClient.guilds.fetch(guildId);
    const channels = await guild.channels.fetch();
    const filteredChannels = Array.from(channels.values())
      .filter((channel: any) => channel.type === 0)
      .map((channel: any) => ({
        id: channel.id,
        name: channel.name,
        type: channel.type,
      }));

    return filteredChannels;
  } catch (error) {
    throw new ApiError(400, `Error in fetching channels: ${error}`);
  }
};

const getGuildByChannelId = async (channelId: string) => {
  try {
    const channel = await discordClient.channels.fetch(channelId);
    //@ts-ignore
    return channel?.guild;
  } catch (error) {
    throw new ApiError(400, `Error in fetching guild : ${error}`);
  }
};

const getGuildById = async (guildId: string) => {
  try {
    const guild = await discordClient.guilds.fetch(guildId);
    if (!guild)
      throw new ApiError(
        404,
        `No server found based on given serverID ${guildId}`
      );
    return guild;
  } catch (error) {
    throw new ApiError(500, `Error in fetching guild : ${error}`);
  }
};
const sendMessage = async (
  guildId: string,
  channelId: string,
  message: string
) => {
  const guild = await discordClient.guilds.fetch(guildId);
  const channel = await guild.channels.fetch(channelId);
  if (!channel || !channel.isTextBased()) {
    throw new Error("Channel not found or not text-based");
  }
  await channel.send(message);
};

const getChannelsByUserId = async (userId: string) => {
  try {
    return prismaClient.discord.findMany({
      where: {
        userId: userId,
      },
      select: {
        channels: true,
      },
    });
  } catch (error) {
    throw new ApiError(404, "No channels found for the user");
  }
};

const storeDiscordMetadata = async (
  userId: string,
  guild: any,
  channels: any
) => {
  return await prismaClient.discord.upsert({
    where: {
      guildId: guild.id,
    },
    create: {
      userId: userId,
      guildId: guild.id,
      guildName: guild.name,
      botToken: discordConfig.botToken,
      channels: {
        create: channels?.map((channel: any) => ({
          channelId: channel.id,
          channelName: channel.name,
          type: channel.type,
        })),
      },
    },
    update: {
      guildName: guild.name,
      botToken: discordConfig.botToken,
      channels: {
        deleteMany: {},
        create: channels?.map((channel: any) => ({
          channelId: channel.id,
          channelName: channel.name,
          type: channel.type,
        })),
      },
    },
    include: {
      channels: true,
    },
  });
};

export default {
  getRedirectUrl,
  getGuildChannels,
  getGuildByChannelId,
  sendMessage,
  getGuildById,
  getChannelsByUserId,
  storeDiscordMetadata,
};
