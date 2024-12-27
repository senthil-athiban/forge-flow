import { prismaClient } from "../db/index.js";
import { OAuthProfile } from "../types/auth.js";

const getEmailFromProfile = (profile: OAuthProfile) => {
  return profile.email || `${profile.username}@${profile.provider}.com`;
};
const handleOAuthLogin = async (
  profile: OAuthProfile,
  tokens: { accessToken: string; refreshToken: string }
) => {
  try {
    return prismaClient.$transaction(async (tx:any) => {
      const email = getEmailFromProfile(profile);
      const user = await tx.user.upsert({
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

      await tx.oAuthAccount.upsert({
        where: {
          provider_providerUserId: {
            provider: profile.provider,
            providerUserId: profile.id,
          },
        },
        update: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
        create: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          provider: profile.provider,
          providerUserId: profile.id,
          userId: user.id,
        },
      });
      return user;
    });
  } catch (error) {
    console.error("OAuth Login Error:", error);
  }
};

export default {
  getEmailFromProfile,
  handleOAuthLogin,
};
