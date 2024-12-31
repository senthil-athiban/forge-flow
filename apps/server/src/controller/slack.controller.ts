import { asyncMiddleWare } from "@/config/asyncMiddleware";
import { ApiError } from "@/config/error";
import slackService from "@/services/slack.service";
import { Request, Response } from "express";

const getSlackChannels = asyncMiddleWare(async (req:Request, res: Response) => {
    const code = req.query.code as string;
    if(!code) throw new ApiError(404, 'code was not found');
    const {workspaceToken} = await slackService.getWorkspaceDetails(code);
    const channels = await slackService.getSlackChannels(workspaceToken);
    res.status(201).send({channels});
})

export default { getSlackChannels };