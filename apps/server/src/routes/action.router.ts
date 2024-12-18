import { NextFunction, Request, Response, Router } from "express";
import { authMiddleware } from "../middlware";
import { prismaClient } from "../db";


const router = Router();

router.get("/", authMiddleware,  async  (req: Request, res: Response) => {
    try {
        const response = await prismaClient.actionTypes.findMany({});
        return res.status(200).json({results: response});
    } catch (error) {
        console.log('[ERROR IN QUERYING TRIGGER TYPES]', error);
        return res.status(500).json({error: error});
    }
})

export const actionRouter = router;