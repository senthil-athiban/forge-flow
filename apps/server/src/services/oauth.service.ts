import { prisma } from "@repo/db";
import { prismaClient } from "../db";
import { OAuthProfile } from "../types/auth";
import tokenService from "./token.service";

const getEmailFromProfile = (profile: OAuthProfile) => {
  return profile.email || `${profile.username}@${profile.provider}.com`;
};
const handleOAuthLogin = async (
  profile: OAuthProfile,
  tokens: { accessToken: string; refreshToken: string }
) => {
  try {
    const email = getEmailFromProfile(profile);
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        image: profile.photos[0].value,
      },
      create: {
        name: profile.displayName!,
        email: email,
        image: profile.photos[0].value,
        emailVerified: profile.emailVerified,
      },
    });
    
    return prismaClient.$transaction(async (tx:any) => {
      const { accesstoken, refreshToken } = await tokenService.generateAuthTokens(user);
      await tx.oAuthAccount.upsert({
        where: {
          provider_providerUserId: {
            provider: profile.provider,
            providerUserId: profile.id,
          },
        },
        update: {
          accessToken: accesstoken,
          refreshToken: refreshToken,
        },
        create: {
          accessToken: accesstoken,
          refreshToken: refreshToken,
          provider: profile.provider,
          providerUserId: profile.id,
          userId: user.id,
        },
      });
      return user;
    }, {
      timeout: 10000, 
      maxWait: 15000,
    });
  } catch (error) {
    console.error("OAuth Login Error:", error);
  }
};

export default {
  getEmailFromProfile,
  handleOAuthLogin,
};
