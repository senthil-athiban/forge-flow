import { DISCORD_CLIENT_ID, DISCORD_REDIRECT_URI } from "@/config/config";
import { discordClient } from "@/config/discord";
import { ApiError } from "@/config/error";

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
}

const getGuildById = async (guildId: string) => {
  try {
    const guild = await discordClient.guilds.fetch(guildId);
    if(!guild) throw new ApiError(404, `No server found based on given serverID ${guildId}`)
      return guild;
  } catch (error) {
    throw new ApiError(500, `Error in fetching guild : ${error}`)
  }
}
const sendMessage = async (guildId: string, channelId: string, message: string) => {
    const guild = await discordClient.guilds.fetch(guildId);
    const channel = await guild.channels.fetch(channelId);
    if (!channel || !channel.isTextBased()) {
      throw new Error('Channel not found or not text-based');
    }
    await channel.send(message);
}

export default { getRedirectUrl, getGuildChannels, getGuildByChannelId, sendMessage, getGuildById };
