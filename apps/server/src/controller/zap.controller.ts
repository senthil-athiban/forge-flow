import {Request, Response} from "express";
import { asyncMiddleWare } from "../config/asyncMiddleware";
import { ApiError } from "../config/error";
import { zapSchema } from "../schema";
import zapService from "../services/zap.service";

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
    const zap  = await zapService.getZapByUserId(userId);
    res.status(200).send(zap);
})

const getUserZap = asyncMiddleWare(async (req: Request, res: Response) => {
    const zapId = req.params.zapId as string;
    const userId = req.userId as string;
    const zap = await zapService.getZapById(userId, zapId);
    res.status(200).send({zap});
});

const testZapRun = asyncMiddleWare( async (req: Request, res: Response) => {
    const zapRunId = req.body.zapRunId as string;
    const userId = req.userId as string;
    const zap = await zapService.testZapRun(userId, zapRunId);
    res.status(200).send({message: "Tested"});
})

const deleteZap = asyncMiddleWare( async ( req: Request, res: Response) => {
    const zapId = req.body.zapId as string;
    const userId = req.userId as string;
    const zap = await zapService.getZapById(userId, zapId);
    if (!zap) throw new ApiError(404, 'No zap has been found');
    await zapService.deleteZapById(userId, zap.id);
    res.status(204);
})

const deleteZapRun = asyncMiddleWare( async ( req: Request, res: Response) => {
    const zapRunId = req.body.zapRunId as string;
    const userId = req.userId as string;
    const zapRun = await zapService.getZapById(userId, zapRunId);
    if (!zapRun) throw new ApiError(404, 'No zap run has been found');
    await zapService.deleteZapRunById(userId, zapRun.id);
    res.status(204);
})

export default { createZap, getUserZaps, getUserZap, testZapRun, deleteZapRun, deleteZap };