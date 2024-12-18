import { Request, Response } from "express";
import bcyprtjs from "bcryptjs";
import jwt, { sign } from "jsonwebtoken";
import tokenService from "../services/token.service";
import emailService from "../services/email.service";
import { prismaClient } from "../db";
import { forgotPasswordSchema, SignInSchema, SignUpSchema } from "../schema";
import { ApiError } from "../config/error";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../config/config";
import userService from "../services/user.service";
import authService from "../services/auth.service";
import { TokenType } from "@prisma/client";

const register = async (req: Request, res: Response) => {
  const body = req.body;

  // data validation
  const parsedData = SignUpSchema.safeParse(body);
  if (!parsedData.success)
    return res.status(400).json({ error: "Invalid Inputs" });
  const { email, password, name } = parsedData.data;

  // check if user exists
  const existingUser = await prismaClient.user.findFirst({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    if (!existingUser.emailVerified) {
      await tokenService.generateEmailVerificationToken(existingUser);
      return res.status(400).json({
        message:
          "You have already registered, but your email is not verified. A new verification email has been sent.",
      });
    }
    return res.status(401).json({
      message:
        "The email address you have entered is already associated with another verified account.",
    });
  }

  // create new user is not exists in db
  const hashedPassword = await bcyprtjs.hash(password, 10);
  const user = await prismaClient.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  // email verification
  tokenService.generateEmailVerificationToken(user);

  return res.status(200).json({
    message: "Verification email has been sent",
  });
};

const login = async (req: Request, res: Response) => {
  try {
    const body = req.body;
  const user = await authService.loginUsingEmailPassword(body);
  const { accesstoken, refreshToken } =
    await tokenService.generateAuthTokens(user);
  res.cookie("jwt", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  return res.status(200).json({
    message: {
      accesstoken: accesstoken,
    },
  });
  } catch (error) {
    if (error instanceof ApiError) {
      //@ts-ignore
      return res.status(error.statusCode).json({ error: error.message });
    }
  }
};

const verifyEmail = async (req: Request, res: Response) => {
  try {
    const token = req.query.token as string;
    await emailService.verifyEmail(token);
    return res.status(201).json({ message: "You are verified" });
  } catch (error) {
    if (error instanceof ApiError) {
      //@ts-ignore
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal error" });
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const token = req.cookies.jwt;

    const verifiedToken = await tokenService.verifyToken(
      token,
      TokenType.REFRESH,
      JWT_REFRESH_SECRET
    );
    const user = await userService.getUser({
      where: { id: verifiedToken.userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return res.status(401).json({ message: "No user found" });
    }
    const { accesstoken, refreshToken } =
      await tokenService.generateAuthTokens(user);

    res.cookie("jwt", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res.status(201).json({
      message: {
        accesstoken: accesstoken,
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      //@ts-ignore
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal error" });
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const parsedData = forgotPasswordSchema.safeParse(body);
    const user = await userService.getUser({
      where: { email: parsedData.data?.email },
      select: { id: true, email: true },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!parsedData.success) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    await tokenService.generateResetPasswordToken(user);
    return res
      .status(201)
      .json({ message: "An email has been sent to reset your password" });
  } catch (error) {
    if (error instanceof ApiError) {
      //@ts-ignore
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal error" });
  }
};

const resetPassword = async(req: Request, res: Response) => {
  const token = req.query.token as string;
  const password = req.body.password;
  await authService.resetPassword(token, password);
  res.status(204).send();
}

export default { register, verifyEmail, login, refreshToken, forgotPassword , resetPassword};
