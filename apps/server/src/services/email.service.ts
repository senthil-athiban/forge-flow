import dotenv from "dotenv";
import { resendService, transporter } from "@repo/common";

import { prismaClient } from "../db";
import tokenService from "./token.service";

import { ApiError } from "../config/error";
import { DOMAIN, FROM_EMAIL } from "../config/config";
import { TokenTypes } from "../config/tokenTypes";

dotenv.config();

const verifyEmail = async (token: string) => {
  const verifiedToken = await tokenService.verifyToken(
    token,
    TokenTypes.VERIFY_EMAIL
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
        type: TokenTypes.VERIFY_EMAIL,
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
    console.log('error: ', error);
    throw new ApiError(500, "Error in verifying user");
  }
};

const sendVerificationEmail = async (to: string, token: string) => {
  const subject = "Email Verification";
  const verificationEmailUrl = `http://${DOMAIN}/api/v1/auth/verify-email?token=${token}`;
  const from = FROM_EMAIL;
  const body = `Dear user,  
  To verify your email, click on this link: ${verificationEmailUrl}`;
  await resendService.sendWorkflowEmail(from, to, subject, body)
};

const sendResetPasswordEmail = async (to: string, token: string) => {
  const subject = "Reset password";
  const from = FROM_EMAIL;
  const verificationEmailUrl = `http://${DOMAIN}/api/v1/auth/reset-password?token=${token}`;
  const body = `Dear user,
  To reset your password, click on this link: ${verificationEmailUrl}`;
  await resendService.sendWorkflowEmail(from, to, subject, body)
}

export default {
  sendVerificationEmail,
  sendResetPasswordEmail,
  verifyEmail,
};
