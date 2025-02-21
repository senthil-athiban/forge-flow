import bcyprtjs from "bcryptjs";
import { prisma, type User } from "@repo/db";
import { ApiError } from "../config/error";
import { SignUpType } from "../schema/index";
import tokenService from "./token.service";

interface UserQueryParams {
  where: {
    [key: string]: any;
  };
  select?: {
    [key: string]: boolean;
  };
}

interface UserQueryUpdate {
  email?: string;
  password?: string;
  emailVerified?: boolean;
}

const getUser = async (params: UserQueryParams) => {
  try {
    return await prisma.user.findFirst({
      where: params.where,
      select: params.select,
    });
    
  } catch (error) {
    throw new Error("Error in fetching user");
  }
};

const updateUserById = async (
  userId: string,
  contentToUpdate: UserQueryUpdate
) => {
  try {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: contentToUpdate,
    });
  } catch (error) {
    throw new Error("Error in updating user");
  }
};

const verifyUser = async (userId: string) => {
  try {
    return await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  } catch (error) {
    throw new ApiError(400, "No user exists");
  }
};

const createUser = async (userData: SignUpType) => {
    const { email, name, password } = userData;
    // check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    // verify if email is verified
    if (existingUser) {
      if (!existingUser.emailVerified) {
        await tokenService.generateEmailVerificationToken(existingUser);
        throw new ApiError(
          400,
          "Email is already registered but not yet verified. We've sent a new verification link to your email address."
        );
      }
      throw new ApiError(
        409,
        "Email address is already in use. Please log in or use a different email."
      );
    }

    // create new user is not exists in db
    const hashedPassword = await bcyprtjs.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    return user as User;
};

const getUserToken = async (userId: string, provider: string) => {
  // todo change to unique
  try {
    const user = await prisma.oAuthAccount.findFirst({
      where: {
        userId: userId,
        provider: provider
      },
      select: {
        accessToken: true,
        refreshToken: true
      }
    });
    if(!user) {
      throw new ApiError(404, "No user was found");
    }
    return user;
  } catch (error) {
    throw new ApiError(400, "Bad request");
    // throw new ApiError(500, "Internal Server error");
  }
}
export default { getUser, updateUserById, verifyUser, createUser, getUserToken };
