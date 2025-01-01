import { Request, Response } from "express";
import { asyncMiddleWare } from "../config/asyncMiddleware";
import { ApiError } from "../config/error";
import slackService from "../services/slack.service";
import userService from "../services/user.service";

const storeSlackMetadata = asyncMiddleWare(async (req:Request, res: Response) => {
    const code = req.query.code as string;
    const userId = req.query.userId as string;
    if(!code) throw new ApiError(404, 'code was not found');
    const {workspaceToken} = await slackService.getWorkspaceDetails(code, userId);
    const channels = await slackService.getSlackChannels(workspaceToken);
    res.status(201).send({channels, workspaceToken});
});

const getUserSlackChannel = asyncMiddleWare(async(req: Request, res: Response) => {
    const userId = req.query.userId as string;
    const user = await userService.getUser({where: {id: userId}, select: {id: true}});
    if(!user) throw new ApiError(404, "No slack channels were found with the corresponding user");
    const channels = await slackService.getSlackChannels(user.id)
    res.status(201).send({channels});
})

export default { storeSlackMetadata, getUserSlackChannel };