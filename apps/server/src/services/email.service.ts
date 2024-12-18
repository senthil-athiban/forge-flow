import nodemailer from "nodemailer";
import dotenv from "dotenv";
import tokenService from "./token.service";
import { Token, TokenType, User } from "@prisma/client";
import { prismaClient } from "../db";
import { ApiError } from "../config/error";

dotenv.config();
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendEmail = async (to: string, subject: any, content: any) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text: content,
  });
};

const verifyEmail = async (token: string) => {
  const verifiedToken = await tokenService.verifyToken(
    token,
    TokenType.VERIFY_EMAIL
  );
  try {
    const user = await prismaClient.user.findFirst({
      where: {
        id: verifiedToken.userId,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    await prismaClient.token.deleteMany({
      where: {
        userId: user.id,
        type: TokenType.VERIFY_EMAIL,
      },
    });

    await prismaClient.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: true,
      },
    });
  } catch (error) {
    throw new ApiError(500, "Error in verifying user");
  }
};

const sendVerificationEmail = async (to: string, token: string) => {
  const subject = "Email Verification";
  const verificationEmailUrl = `http://${process.env.DOAMIN}/verify-email?token=${token}`;
  const text = `Dear user,
  To verify your email, click on this link: ${verificationEmailUrl}`;
  await sendEmail(to, subject, text);
};

export default {
  sendEmail,
  sendVerificationEmail,
  verifyEmail,
};
