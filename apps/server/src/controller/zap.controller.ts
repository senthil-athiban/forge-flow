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

export default { createZap };