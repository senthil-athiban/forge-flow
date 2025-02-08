import { Client, GatewayIntentBits } from "discord.js";
import { discordConfig } from "../config/discord.config";
import pino from "pino";
import { ApiError } from "../config/error";
import { prisma } from "@repo/db";

const logger = pino();

class DiscordService {
  private static instance: DiscordService;
  private readonly MAX_RETIES  = 3;
  private readonly RETRY_INTERVAL = 1000;
  private isConnected: boolean = false;
  private client: Client;
  private messageQueue: Array<{
    guildId: string;
    channelId: string;
    message: string;
    retries: number;
  }> = [];

  private constructor() {
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    });
    this.setupEventHandlers();
  }

  public static getInstance(): DiscordService {
    if (!this.instance) {
      this.instance = new DiscordService();
    }
    return this.instance;
  }

  public getClient() {
    if(!this.client) {
      this.client = new Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
      });
    }
    return this.client;
  }

  private setupEventHandlers() {
    this.client.on("ready", () => {
      this.isConnected = true;
      logger.info('Discord client ready');
    });

    this.client.on("shardDisconnect", () => {
      this.isConnected = false;
      logger.warn(`Discord client is disconnected`);
    });
  }

  private async connect() {
    if (!this.isConnected) {
      await this.client.login(discordConfig.botToken);
      logger.info('Discord client is connected');
      this.isConnected = true;
    }
  }

  public async sendMessage(
    guildId: string,
    channelId: string,
    message: string
  ) {
    try {
      await this.connect();
      if (this.isConnected) {
        this.messageQueue.push({ guildId, channelId, message, retries: 0 });
      }

      await this.processQueue();
    } catch (error) {
      logger.error({ error }, 'Error queueing Discord message');
      throw new ApiError(400, "Error queuing Discord messages");
    }
  }

  private async processQueue() {

    while (this.messageQueue.length > 0) {
      const item = this.messageQueue[0];
      
      try {
        const guild = await this.client?.guilds.fetch(item.guildId);
        const channel = await guild.channels.fetch(item.channelId);
        if (!channel || !channel.isTextBased()) {
          throw new ApiError(404, "Channel not found or not text-based");
        }

        await channel.send(item.message);

        this.messageQueue.shift();
      } catch (error) {

        logger.error({ error }, 'Error processing Discord message');
        
        if (item.retries < this.MAX_RETIES) {
            item.retries++;
            setInterval(() => this.processQueue(), this.RETRY_INTERVAL);
            console.info(`Retrying ${item} for ${item.retries} times`)
        } else {
            this.messageQueue.shift();
            console.info(`Max Retries reached for ${item}`);
            logger.error('Max retries reached for message');
        }
      }
    }
  }

  public async findChannelById(channelId: string) {
    try {
      return await prisma.discordChannel.findFirst({
        where: {
          channelId: channelId,
        },
        select: {
          channelId: true,
          discord: {
            select: {
              guildId: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error({error}, 'Failed to fetch channel from db');
      throw new ApiError(400, 'Failed to fetch channel from db');
    }
  }

  public async getRedirectUrl () {
    const redirectUrl = `https://discord.com/oauth2/authorize?client_id=${discordConfig.clientId}&permissions=2048&response_type=code&redirect_uri=${discordConfig.redirectUri}&integration_type=0&scope=guilds+bot`;
    return redirectUrl;
  };
  
  public async getGuildChannels (guildId: string) {
    try {
      const isInGuild = this.client.guilds.cache.has(guildId);
      if (!isInGuild) {
        throw new ApiError(400, `Bot is not in server ${guildId}`);
      }
  
      const guild = await this.client.guilds.fetch(guildId);
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
  
  public async getGuildByChannelId (channelId: string) {
    try {
      const channel = await this.client.channels.fetch(channelId);
      //@ts-ignore
      return channel?.guild;
    } catch (error) {
      throw new ApiError(400, `Error in fetching guild : ${error}`);
    }
  };
  
  public async getGuildById (guildId: string) {
    try {
      const guild = await this.client.guilds.fetch(guildId);
      if (!guild)
        throw new ApiError(
          404,
          `No server found based on given serverID ${guildId}`
        );
      return guild;
    } catch (error) {
      logger.error({error}, 'Failed to query discord guild by guildId');
      throw new ApiError(500, `Error in fetching guild : ${error}`);
    }
  };
  
  public async getChannelsByUserId (userId: string) {
    try {
      return prisma.discord.findMany({
        where: {
          userId: userId,
        },
        select: {
          channels: true,
        },
      });
    } catch (error) {
      logger.error({error}, 'Failed to fetch discord channels by userId');
      throw new ApiError(404, "No channels found for the user");
    }
  };
  
  public async storeDiscordMetadata (
    userId: string,
    guild: any,
    channels: any
  ) {
    return await prisma.discord.upsert({
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
}

export default DiscordService;