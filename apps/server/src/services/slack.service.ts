import { WebClient } from "@slack/web-api";
import { ApiError } from "../config/error";
import { prismaClient } from "../db";
import { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, SLACK_REDIRECT_URI } from "../config/config";

const getWorkspaceDetails = async (code: string, userId : string) => {
    try {
        const web = new WebClient();
    console.log("---reached 1----");
    console.log({
        "SLACK_CLIENT_ID": SLACK_CLIENT_ID,
        "SLACK_CLIENT_SECRET": SLACK_CLIENT_SECRET,
        "SLACK_REDIRECT_URI": SLACK_REDIRECT_URI,
        "code": code
    })
        const response = await web.oauth.v2.access({
            client_id: SLACK_CLIENT_ID,
            client_secret: SLACK_CLIENT_SECRET,
            code: code,
            redirect_uri: SLACK_REDIRECT_URI
        });
    console.log("---reached 2----");
    const workspaceToken = response.access_token;
    console.log("workspace token : ", workspaceToken);
    if(!workspaceToken) throw new ApiError(404, "Workspace token was not found");
    const workspaceId = response.team?.id;
    console.log("workspace id :  ", workspaceId);
    if(!workspaceId) throw new ApiError(404, "Workspace id was not found");

    const slackClient = new WebClient(workspaceToken);
    const conversations = await slackClient.conversations.list();
    console.log("conversations : ", conversations);
    const result = await prismaClient.slack.create({
        data: {
            userId: userId,
            workspaceId: workspaceId,
            workspaceToken: workspaceToken,
            channels: {
                create: conversations.channels?.map((channel:any) => ({
                    channelId: channel.id,
                    name: channel.name,
                    isPrivate: channel.is_private
                }))
            }
        },
        include: {
            channels: true
        }
    });
    console.log("results : ", result);
    return {workspaceToken, workspaceId, channels: result.channels};
    } catch (error) {
        console.log(error);
    }
}

const getSlackChannels = async (userId: string) => {
    const channels = await prismaClient.slack.findFirst({
        where: {
            userId: userId
        },
        select: {
            channels: true
        }
    });
    return channels;
}

export default { getWorkspaceDetails, getSlackChannels }