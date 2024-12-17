import express from "express";
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
dotenv.config();

const client = new PrismaClient();
const PORT = process.env.DOMAIN;

const app = express();
app.use(express.json());


//@ts-ignore
app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const body = req.body;
    // check user exists
    // verify the zapId is belongs to the user
    console.log("zap id: ", zapId);
    const response = await client.$transaction(async (tx) => {
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
    return res.json({"message": response});
})

app.listen(PORT, () => console.log(`server listening on ${PORT}`));