import { Request, Response } from "express";
import passport from "passport";
import { TokenTypes } from "../config/tokenTypes";
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
  res.status(200).send({message: "Verification email has been sent"});
});

const login = asyncMiddleWare(async (req: Request, res: Response) => {
  const user = await authService.loginUsingEmailPassword(req.body);
  const { accesstoken, refreshToken } = await tokenService.generateAuthTokens(user);
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
  try {
    await emailService.verifyEmail(token);
    res.redirect(`${process.env.CLIENT_URL}/login?verified=true`);  
  } catch (error : any) {
    if (error.message === "Token expired") {
      return res.redirect(`${process.env.CLIENT_URL}/login?expired=true`);
    }
    return res.redirect(`${process.env.CLIENT_URL}/login?invalid=true`);
  }
  
});

const refreshToken = asyncMiddleWare(async (req: Request, res: Response) => {
  const token = req.cookies.jwt;
  const verifiedToken = await tokenService.verifyToken(
    token,
    TokenTypes.REFRESH,
    JWT_REFRESH_SECRET
  );
  const user = await userService.getUser({
    where: { id: verifiedToken.userId },
    select: { id: true, email: true, name: true },
  });

  if (!user) {
    throw new ApiError(404, "No user found");
  }
  const { accesstoken, refreshToken } =
    await tokenService.generateAuthTokens(user);
    
  res.cookie("jwt", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(201).send({
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
  //@ts-ignore
  const userId = req.user?.id;
  if (!req.user) {
    throw new ApiError(401, "Unauthorized access")
  }
  const encodedUserId = Buffer.from(userId).toString("base64");
  const encodedQueryParams = `id=${encodedUserId}&provider=google`;
  return res.redirect(`${process.env.CLIENT_URL}/oauth/verify?${encodedQueryParams}`);
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
  //@ts-ignore
  const userId = req.user?.id;
  if (!req.user) {
    throw new ApiError(401, "Unauthorized access")
  }
  const encodedUserId = Buffer.from(userId).toString("base64");
  const encodedQueryParams = `id=${encodedUserId}&provider=github`;
  return res.redirect(`${process.env.CLIENT_URL}/oauth/verify?${encodedQueryParams}`);
};

const githubAuthFailure = async (req: Request, res: Response) => {
  return res.redirect(`${process.env.CLIENT_URL}/login`);
};

const verify = async (req: Request, res: Response) => {
  const id = req.query.id as string;
  const provider = req.query.provider as string;
  if(!id || !provider){
    throw new ApiError(400, "Bad request");
  }
  const userId = Buffer.from(id, 'base64').toString('utf-8');
  if(!userId || !provider) {
    throw new ApiError(400, "Bad request");
  }
  const user = await userService.getUserToken(userId, provider);
  res.cookie("jwt", user.refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).send({"accessToken": user.accessToken});
}

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
  verify
};
