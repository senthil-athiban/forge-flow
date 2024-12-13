import { NextFunction, Request, Response, Router } from "express";
import {prismaClient} from "../db/index";
import { authMiddleware } from "../middlware";

const router = Router();

router.get("/", authMiddleware,  async  (req: Request, res: Response) => {
    try {
        const response = await prismaClient.triggerTypes.findMany({});
        return res.status(200).json({results: response});
    } catch (error) {
        console.log('[ERROR IN QUERYING TRIGGER TYPES]', error);
        return res.status(500).json({error: error});
    }
})

export const triggerRouter = router;