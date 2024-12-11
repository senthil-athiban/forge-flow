import express from "express";
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();

dotenv.config();
const app = express();
const PORT = process.env.DOMAIN;

//@ts-ignore
app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    console.log("zap id: ", zapId);
    const response = await client.$transaction(async (tx) => {
        const zapRun = await tx.zapRun.create({
            data: {
                zapId: zapId
            }
        });

        const zapRunOutBox = await tx.zapRunOutBox.create({
            data: {
                zapRunId: zapRun.id
            }
        });

        return zapRunOutBox
    });
    return res.json({"message": response});
})

app.listen(PORT, () => console.log(`server listening on ${PORT}`));