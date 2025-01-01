import { WebClient } from "@slack/web-api";
import { ApiError } from "../config/error";
import { prismaClient } from "../db";
import {
  SLACK_CLIENT_ID,
  SLACK_CLIENT_SECRET,
  SLACK_REDIRECT_URI,
} from "../config/config";

const getWorkspaceDetails = async (code: string, userId: string) => {
  try {
    const web = new WebClient();
    const response = await web.oauth.v2.access({
      client_id: SLACK_CLIENT_ID,
      client_secret: SLACK_CLIENT_SECRET,
      code: code,
      redirect_uri: SLACK_REDIRECT_URI,
    });
    const workspaceToken = response.access_token;
    if (!workspaceToken)
      throw new ApiError(404, "Workspace token was not found");
    const workspaceId = response.team?.id;
    if (!workspaceId) throw new ApiError(404, "Workspace id was not found");

    const slackClient = new WebClient(workspaceToken);
    const conversations = await slackClient.conversations.list();
    const result = await prismaClient.slack.upsert({
      where: {
        workspaceId
      },
      create: {
        userId: userId,
        workspaceId,
        workspaceToken,
        channels: {
          create: conversations.channels?.map((channel: any) => ({
            channelId: channel.id,
            name: channel.name,
            isPrivate: channel.is_private,
          })),
        },    
      },
      update: {
        workspaceToken,
        channels: {
          deleteMany: {},
          create: conversations.channels?.map((channel: any) => ({
            channelId: channel.id,
            name: channel.name,
            isPrivate: channel.is_private,
          })),
        },    
      },
      include: {
        channels: true
      }
    });
    return { workspaceToken, workspaceId, channels: result.channels };
  } catch (error) {
    console.log(error);
  }
};

const getSlackChannels = async (userId: string) => {
  const channels = await prismaClient.slack.findMany({
    where: {
      userId: userId,
    },
    select: {
      channels: true,
    },
  });
  return channels;
};

export default { getWorkspaceDetails, getSlackChannels };
