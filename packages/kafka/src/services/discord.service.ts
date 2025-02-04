import { Client, GatewayIntentBits } from "discord.js";
import { discordConfig } from "../config/discord.config";
import pino from "pino";

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
      console.error("Error queuing Discord messages : ", error);
      logger.error({ error }, 'Error queueing Discord message');
    }
  }

  private async processQueue() {
    while (this.messageQueue.length > 0) {
      const item = this.messageQueue[0];
      try {
        const guild = await this.client?.guilds.fetch(item.guildId);
        const channel = await guild.channels.fetch(item.channelId);
        if (!channel || !channel.isTextBased()) {
          throw new Error("Channel not found or not text-based");
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
}

export const discordService = DiscordService.getInstance();