import { Request, Response, Router } from "express";
import { SignInSchema, SignUpSchema } from "../schema";
import { prismaClient } from "../db/index";
import bcyprtjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middlware";
import dotenv from "dotenv";
import { Token, TokenType, User } from "@prisma/client";
import { ApiError } from "../config/error";
import authController from "../controller/auth.controller";
dotenv.config();

const router = Router();

// during login
const generateAuthTokens = (user: any) => {
  const accesstoken = jwt.sign(
    { userId: user.id },
    process.env.JWT_ACCESS_SECRET!,
    {
      expiresIn: "1d",
    }
  );
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_ACCESS_SECRET!,
    {
      expiresIn: "7d",
    }
  );

  return { accesstoken, refreshToken };
};

router.get("/", authMiddleware, async (req: Request, res: Response) => {
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
