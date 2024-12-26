import { Request, Response } from "express";
import { TokenType } from "@prisma/client";
import passport from "passport";
import tokenService from "../services/token.service";
import emailService from "../services/email.service";
import userService from "../services/user.service";
import authService from "../services/auth.service";
import { forgotPasswordSchema, SignUpSchema } from "../schema";
import { JWT_REFRESH_SECRET } from "../config/config";
import { ApiError } from "../config/error";
import { asyncMiddleWare } from "../config/asyncMiddleware";
import "../config/passport";


const register = asyncMiddleWare(async (req: Request, res: Response) => {
  const parsedData = SignUpSchema.safeParse(req.body);
  if (!parsedData.success) {
    throw new ApiError(400, "Invalid inputs");
  }
  const user = await userService.createUser(parsedData.data);
  tokenService.generateEmailVerificationToken(user);
  res.status(200).send("Verification email has been sent");
});

const login = asyncMiddleWare(async (req: Request, res: Response) => {
  const user = await authService.loginUsingEmailPassword(req.body);
  const { accesstoken, refreshToken } =
    await tokenService.generateAuthTokens(user);
  res.cookie("jwt", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).send({ accesstoken: accesstoken });
});

const verifyEmail = asyncMiddleWare(async (req: Request, res: Response) => {
  const token = req.query.token as string;
  await emailService.verifyEmail(token);
  res.status(201).send({ message: "You are verified" });
});

const refreshToken = asyncMiddleWare(async (req: Request, res: Response) => {
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
});

const forgotPassword = asyncMiddleWare(async (req: Request, res: Response) => {
  const parsedData = forgotPasswordSchema.safeParse(req.body);
  if (!parsedData.success) {
    throw new ApiError(400, "Invalid credentials");
  }

  const user = await userService.getUser({
    where: { email: parsedData.data?.email },
    select: { id: true, email: true },
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  await tokenService.generateResetPasswordToken(user);
  return res
    .status(201)
    .json({ message: "An email has been sent to reset your password" });
});

const resetPassword = async (req: Request, res: Response) => {
  const token = req.query.token as string;
  const password = req.body.password;
  await authService.resetPassword(token, password);
  res.status(204).send();
};

const googleAuth = passport.authenticate("google", {
  scope: ["email", "profile"],
});

const googleAuthCallback = passport.authenticate("google", {
  successRedirect: "/api/v1/auth/google/success",
  failureRedirect: "/api/v1/auth/google/failure",
});

const googleAuthSuccess = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized access")
  }
  return res.redirect(`${process.env.CLIENT_URL}/dashboard`);
};

const googleAuthFailure = async (req: Request, res: Response) => {
  return res.redirect(`${process.env.CLIENT_URL}/login`);
};

const githubAuth = passport.authenticate("github", { scope: ["user:email"] });

const githubAuthCallback = passport.authenticate("github", {
  failureRedirect: "/api/v1/auth/github/failure",
  successRedirect: "/api/v1/auth/github/success",
});

const githubAuthSuccess = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized access");
  }

  return res.redirect(`${process.env.CLIENT_URL}/dashboard`);
};

const githubAuthFailure = async (req: Request, res: Response) => {
  return res.redirect(`${process.env.CLIENT_URL}/login`);
};

export default {
  register,
  verifyEmail,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  googleAuth,
  googleAuthCallback,
  githubAuth,
  githubAuthCallback,
  googleAuthFailure,
  googleAuthSuccess,
  githubAuthSuccess,
  githubAuthFailure,
};
