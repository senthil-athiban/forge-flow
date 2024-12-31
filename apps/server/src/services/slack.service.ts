import { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, SLACK_REDIRECT_URI } from "@/config/config";
import { ApiError } from "@/config/error";
import { WebClient } from "@slack/web-api";

const getWorkspaceDetails = async (code: string) => {
    const web = new WebClient();
    const response = await web.oauth.v2.access({
        client_id: SLACK_CLIENT_ID,
        client_secret: SLACK_CLIENT_SECRET,
        code: code,
        redirect_uri: SLACK_REDIRECT_URI
    });
    const workspaceToken = response.access_token;
    if(!workspaceToken) throw new ApiError(404, "Workspace token was not found");
    const workspaceId = response.team?.id;
    if(!workspaceId) throw new ApiError(404, "Workspace id was not found");

    return {workspaceToken, workspaceId};
}

const getSlackChannels = async (workspaceToken: string) => {
    const slackClient = new WebClient(workspaceToken);
    const conversations = await slackClient.conversations.list();
    const channels = conversations?.channels?.map((c: any) => ({
        id: c.id,
        name: c.name,
    }))
    return channels;
}

export default { getWorkspaceDetails, getSlackChannels }