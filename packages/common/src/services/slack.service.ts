import { OauthV2AccessResponse, WebClient } from "@slack/web-api";
import { slackConfig } from "../config/slack.config";
import pino from "pino";
import { prisma } from "@repo/db";
import { ApiError } from "../config/error";

const logger = pino();

interface SlackConfig {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
}

class SlackService {
  private static instance: SlackService;
  private client: WebClient;
  private config: SlackConfig;

  constructor() {
    this.config = {
      client_id: slackConfig.client_id,
      client_secret: slackConfig.client_secret,
      redirect_uri: slackConfig.redirect_uri,
    };
    this.client = new WebClient();
  }

  public static getInstance(): SlackService {
    if (!this.instance) {
      this.instance = new SlackService();
    }
    return this.instance;
  }

  private getWorkSpaceClient(token: string): WebClient {
    return new WebClient(token);
  }

  private async oAuthConfig(code: string): Promise<OauthV2AccessResponse> {
    try {
      const response = this.client.oauth.v2.access({
        client_id: this.config.client_id,
        client_secret: this.config.client_secret,
        code,
        redirect_uri: this.config.redirect_uri,
      });
      return response;
    } catch (error) {
      logger.error({ error }, "Failed to authenticate");
      throw new ApiError(400, 'Failed to autenticate');
    }
  }

  public async getSlackChannels(userId: string) {
    const channels = await prisma.slack.findMany({
      where: {
        userId: userId,
      },
      select: {
        channels: true,
      },
    });
    return channels;
  }

  public async getSlackChannelById(channelId: string) {
    try {
      return await prisma.slackChannel.findFirst({
        where: {
          channelId: channelId,
        },
        include: {
          slack: {
            select: {
              workspaceToken: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error({error}, 'Failed to query channel from slack collection');
    }
  }

  public async sendMessage(params: {
    workspaceToken: string;
    channelId: string;
    message: string;
  }): Promise<boolean> {
    try {
      const { workspaceToken, channelId, message } = params;
      const workspaceClient = this.getWorkSpaceClient(workspaceToken);
      await workspaceClient.conversations
        .join({ channel: channelId })
        .catch((error) => logger.warn({ error }, "Failed to join channel"));

      const result = await workspaceClient.chat.postMessage({
        channel: channelId,
        text: message,
      });

      logger.info(`Message sent successfully: ${result.ts}`);
      return true;
    } catch (error) {
      logger.error({ error }, "Failed to send message");
      throw new ApiError(500, "Failed to send Slack message");
    }
  }

  public async storeWorkSpace(code: string, userId: string) {
    try {
      const response = await this.oAuthConfig(code);
      if (!response.access_token || !response.team?.id) {
        throw new ApiError(404, 'Invalid workspace response');
      }

      const workspaceClient = this.getWorkSpaceClient(response.access_token);
      const conversations = await workspaceClient.conversations.list();
      const result = await this.upsertWorkspace({
        userId,
        workspaceId: response.team.id,
        workspaceToken: response.access_token,
        channels: conversations.channels ?? [],
      });
    } catch (error) {
      logger.error({ error }, "Failed to store workspace data");
      throw new ApiError(400, "Failed to process Slack workspace details");
    }
  }

  private async upsertWorkspace(params: {
    userId: string;
    workspaceId: string;
    workspaceToken: string;
    channels: any[];
  }) {
    const { userId, workspaceId, workspaceToken, channels } = params;

    return prisma.slack.upsert({
      where: { workspaceId },
      create: {
        userId,
        workspaceId,
        workspaceToken,
        channels: {
          create: this.formatChannels(channels),
        },
      },
      update: {
        workspaceToken,
        channels: {
          deleteMany: {},
          create: this.formatChannels(channels),
        },
      },
      include: { channels: true },
    });
  }

  private formatChannels(channels: any[]) {
    return channels.map((channel) => ({
      channelId: channel.id,
      name: channel.name,
      isPrivate: channel.is_private,
    }));
  }
}

export default SlackService;