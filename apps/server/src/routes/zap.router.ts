import { Request, Response, Router } from "express";
import { authMiddleware } from "../middlware";
import { prismaClient } from "../db";
import { zapSchema } from "../schema";
import zapController from "../controller/zap.controller";
const router = Router();

// submit zap endpoint
router.post("/", authMiddleware, zapController.createZap);

// get all zaps
router.get("/", authMiddleware, async (req: Request, res: Response) => {
    //@ts-ignore
    const userId = req.userId;
    

    const zap = await prismaClient.zap.findMany({
        where: {
            userId: userId
        },
        include: {
            trigger: {
                include: {
                    triggerType: true
                }
            },
            actions: {
                include: {
                    actionType: true
                }
            }
        }
    });

    return res.json({zap});
})

// get particular zap
router.get("/:zapId", authMiddleware, async (req: Request, res: Response) => {
    const zapId = req.params.zapId;

    //@ts-ignore
    const userId = req.userId;
    

    const zap = await prismaClient.zap.findFirst({
        where: {
            userId: userId,
            id: zapId
        },
        include: {
            trigger: {
                include: {
                    triggerType: true
                }
            },
            actions: {
                include: {
                    actionType: true
                }
            }
        }
    });

    return res.json({zap});
})

export const zapRouter = router;