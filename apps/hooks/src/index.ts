import express, { Request, Response } from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import {prisma} from '@repo/db';
import { allowedOrigins } from "./config";
dotenv.config();

const PORT = process.env.DOMAIN;

const app = express();
app.use(express.json());
app.use(cors({origin: allowedOrigins}));

app.post("/hooks/catch/:userId/:zapId", async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const body = req.body;
    const userZap = await prisma.zap.findFirst({
        where: {
            userId: userId,
            id: zapId
        }
    });

    if(!userZap) {
        res.status(404).send({message: `No zap has been found with given zapId : ${zapId}`});
    }
    const response = await prisma.$transaction(async (tx) => {
        const zapRun = await tx.zapRun.create({
            data: {
                zapId: zapId,
                metadata: body
            }
        });

        const zapRunOutBox = await tx.zapRunOutBox.create({
            data: {
                zapRunId: zapRun.id
            }
        });

        return zapRunOutBox
    });
    res.status(201).send({"message": response});
})

app.listen(PORT, () => console.log(`server listening on ${PORT}`));