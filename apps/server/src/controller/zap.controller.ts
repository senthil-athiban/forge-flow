import { asyncMiddleWare } from "@/config/asyncMiddleware";
import { ApiError } from "@/config/error";
import { zapSchema } from "@/schema";
import zapService from "@/services/zap.service";
import {Request, Response} from "express";

const createZap = asyncMiddleWare(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const body = req.body;
    const parsedData = zapSchema.safeParse(body);
    if(!parsedData.success) {
      throw new ApiError(500, "Invalid inputs")  
    }
    const zapRun = await zapService.createZap(parsedData.data, userId);
    res.status(200).send({zapRun});
})

const getUserZaps = asyncMiddleWare(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const zap  = zapService.getZapByUserId(userId);
    res.status(200).send({zap});
})

const getUserZap = asyncMiddleWare(async (req: Request, res: Response) => {
    const zapId = req.params.zapId as string;
    const userId = req.userId as string;
    const zap = zapService.getZapById(userId, zapId);
    res.status(200).send({zap});
});

export default { createZap, getUserZaps, getUserZap};