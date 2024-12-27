import { ApiError } from "../config/error.js";
import { SignUpType } from "../schema/index.js";
import { PrismaClient, type User } from "@repo/db";
import tokenService from "./token.service.js";
import bcyprtjs from "bcryptjs";

const prismaClient = new PrismaClient();

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
    return await prismaClient.user.findFirst({
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
    return await prismaClient.user.update({
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
    return await prismaClient.user.findFirst({
      where: {
        id: userId,
      },
      select: {
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
    const existingUser = await prismaClient.user.findFirst({
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
          "You have already registered, but your email is not verified. A new verification email has been sent."
        );
      }
      throw new ApiError(
        401,
        "The email address you have entered is already associated with another verified account."
      );
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
    return user as User;
};
export default { getUser, updateUserById, verifyUser, createUser };
