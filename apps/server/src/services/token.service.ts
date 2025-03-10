import moment from "moment";
import { TokenType, User } from "@repo/db";
import emailService from "./email.service";
import jwt from "jsonwebtoken";
import { prismaClient } from "../db/index";
import { ApiError } from "../config/error";
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_SECRET } from "../config/config";
import { TokenTypes } from "../config/tokenTypes";

const saveToken = async (
  userId: string,
  tokenType: TokenType,
  token: string
) => {
  try {
    return await prismaClient.$transaction(async (tx:any) => {
      await tx.token.deleteMany({
        where: {
          userId,
          type: tokenType
        }
      });
      return await prismaClient.token.upsert({
        where: {
          userId,
          token,
          type: tokenType
        },
        update: {
          token: token
        },
        create: {
          userId: userId,
          token,
          type: tokenType,
        },
      });
    }, {
      timeout: 10000, 
      maxWait: 15000,
    })
  } catch (error:any) {
    console.log('error:', error)
    if (error.code) {
      switch (error.code) {
        case 'P2002':
          throw new ApiError(409, "Token already exists");
        case 'P2003':
          throw new ApiError(400, "Invalid user reference");
        case 'P2025':
          throw new ApiError(404, "Record not found");
        case 'P2000':
          throw new ApiError(400, "Input data validation failed");
      }
    }
    throw new ApiError(400, "Failed to save token");
  }
};

const generateToken = (
  userId: string,
  expires: any,
  type: string,
  config = JWT_SECRET
) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, config);
};

const generateAuthTokens = async (user: any) => {
  if(!user) {
    throw new ApiError(400, "Bad request");
  }
  const accessTokenExpires = moment().add(1, "day");
  const accesstoken = generateToken(
    user.id,
    accessTokenExpires,
    TokenTypes.ACCESS,
    JWT_ACCESS_SECRET
  );

  // edge case to solve while creating new refresh token, make sure to delete the existing token from db
  const refreshTokenExpires = moment().add(3, "days");
  const refreshToken = generateToken(
    user.id,
    refreshTokenExpires,
    TokenTypes.REFRESH,
    JWT_REFRESH_SECRET
  );
  await saveToken(user.id, TokenTypes.REFRESH , refreshToken);

  return {
    accesstoken,
    refreshToken,
  };
};

const verifyToken = async (
  token: string,
  type: TokenType,
  secret = process.env.JWT_SECRET!
) => {
  try {
    const payload = jwt.verify(token, secret);
    const userId = payload.sub as string;
    const tokenDoc = await prismaClient.token.findFirst({
      where: {
        token,
        type,
        userId,
      },
    });
    if (!tokenDoc) {
      throw new ApiError(404, "Token not found");
    }
    return tokenDoc;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(403, "Token expired");
    }
    throw new ApiError(401, "Invalid token");
  }
};

const generateEmailVerificationToken = async (user: User) => {
  const expires = moment().add(1, "minute");
  const token = generateToken(user.id, expires, TokenTypes.VERIFY_EMAIL);
  await prismaClient.$transaction(async (tx:any) => {
    // delete the previous tokens, if exists
    await tx.token.deleteMany({
      where: {
        userId: user.id,
        type: TokenTypes.VERIFY_EMAIL,
      },
    });

    // and generate new token for the user ( email verify token)
    await tx.token.create({
      data: {
        userId: user.id,
        token,
        type: TokenTypes.VERIFY_EMAIL,
      },
    });
  }, {
    timeout: 10000, 
    maxWait: 15000,
  });

  emailService.sendVerificationEmail(user.email, token);
};

const generateResetPasswordToken = async (user: any) => {
  const expires = moment().add(2, "minutes");
  const token = generateToken(user.id, expires, TokenTypes.RESET);
  
  await prismaClient.$transaction(async (tx:any) => {
    // delete the previous tokens
    await tx.token.deleteMany({
      where: {
        userId: user.id,
        type: TokenTypes.RESET,
      },
    });

    // and generate new token for the user ( email verify token)
    await tx.token.create({
      data: {
        userId: user.id,
        token,
        type: TokenTypes.RESET,
      },
    });
  }, {
    timeout: 10000, 
    maxWait: 15000,
  });
  emailService.sendResetPasswordEmail(user.email, token);
};

export default {
  generateEmailVerificationToken,
  generateToken,
  verifyToken,
  generateAuthTokens,
  saveToken,
  generateResetPasswordToken,
};
