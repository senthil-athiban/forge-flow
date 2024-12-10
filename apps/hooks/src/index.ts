import express from "express";
import dotenv from 'dotenv';
import { PrismaClient } from '@repo/db';

dotenv.config();
const client = new PrismaClient();
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

        console.log("zap run : ", zapRun)

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