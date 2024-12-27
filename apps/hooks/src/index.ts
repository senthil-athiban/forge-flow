import express from "express";
import dotenv from 'dotenv';
import {prisma} from '@repo/db';
dotenv.config();

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

    const userZap = await prisma.zap.findFirst({
        where: {
            userId: userId,
            id: zapId
        }
    });

    if(!userZap) {
        return res.status(404).json({message: `No zap has been found with given zapId : ${zapId}`});
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
    return res.json({"message": response});
})

app.listen(PORT, () => console.log(`server listening on ${PORT}`));