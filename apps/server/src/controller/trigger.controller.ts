import { asyncMiddleWare } from "@/config/asyncMiddleware";
import triggerService from "@/services/trigger.service";
import { Request, Response } from "express";

const getAllTriggers = asyncMiddleWare(async  (req: Request, res: Response) => {
    const triggers = await triggerService.getAvailableTriggers();
    res.status(200).send({triggers});
})

export default { getAllTriggers }