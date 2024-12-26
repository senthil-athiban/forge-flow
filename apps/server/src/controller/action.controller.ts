import { asyncMiddleWare } from "@/config/asyncMiddleware";
import actionService from "@/services/action.service";
import { Request, Response } from "express";
const getAllActions = asyncMiddleWare(async  (req: Request, res: Response) => {
    const actions = await actionService.getAvailableActions();
    res.status(200).send({actions});
})

export default { getAllActions };