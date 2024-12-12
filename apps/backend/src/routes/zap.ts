import { Request, Response, Router } from "express";
import { authMiddleware } from "../middlware";
import { prismaClient } from "../db";
import { zapSchema } from "../schema";

const router = Router();

// submit zap endpoint
router.post("/", authMiddleware, async (req: Request, res: Response) => {
    //@ts-ignore
    const userId = req.userId;
    const body = req.body;

    const parsedData = zapSchema.safeParse(body);

    console.log("parsed data : ", parsedData);
    
    if(!parsedData.success) return res.status(500).json({message: "Invalid inputs"});

    const { triggerTypeId , actions} = parsedData.data;
    const zapRun = await prismaClient.$transaction(async (tx:any) => {
        const zap = await tx.zap.create({
            data: {
                userId: userId,
                actions: {
                    create: actions.map((it:any) => ({
                        actionTypeId: it.actionTypeId,
                    }))
                }
            }
        });

        const trigger = await tx.trigger.create({
            data: {
                triggerTypeId: triggerTypeId,
                zapId: zap.id
            }
        });

        return zap;
    });

    return res.json({zapRun});
});

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