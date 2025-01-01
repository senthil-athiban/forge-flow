import { Request, Response } from "express";
import { asyncMiddleWare } from "../config/asyncMiddleware";
import { ApiError } from "../config/error";
import slackService from "../services/slack.service";
import userService from "../services/user.service";
import { CLIENT_URL } from "@/config/config";

const storeSlackMetadata = asyncMiddleWare(async (req:Request, res: Response) => {
    const code = req.query.code as string;
    const state = req.query.state as string;
    
    const { userId } = JSON.parse(atob(state));
    if(!code) throw new ApiError(404, 'code was not found');
    if(!userId) throw new ApiError(404, "User id was not found");
    const result = await slackService.getWorkspaceDetails(code, userId);
    res.redirect(`${CLIENT_URL}/zap/slack/success`);
});

const getUserSlackChannel = asyncMiddleWare(async(req: Request, res: Response) => {
    const userId = req.userId as string;
    const user = await userService.getUser({where: {id: userId}, select: {id: true}});
    if(!user) throw new ApiError(404, "No slack channels were found with the corresponding user");
    const channels = await slackService.getSlackChannels(user.id)
    res.status(201).send({channels});
})

export default { storeSlackMetadata, getUserSlackChannel };