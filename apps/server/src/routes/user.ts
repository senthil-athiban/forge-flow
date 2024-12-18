import { Request, Response, Router } from "express";
import { prismaClient } from "../db/index";
import { authMiddleware } from "../middlware";
import dotenv from "dotenv";
const router = Router();

router.get("/verify", authMiddleware, async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;
  const user = await prismaClient.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      email: true,
      name: true,
    },
  });

  return res.status(200).json({
    user,
  });
});

export const userRouter = router;
