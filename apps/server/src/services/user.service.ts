import { ApiError } from "../config/error";
import { SignUpType } from "../schema/index";
import { prisma, type User } from "@repo/db";
import tokenService from "./token.service";
import bcyprtjs from "bcryptjs";

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
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    return user as User;
};
export default { getUser, updateUserById, verifyUser, createUser };
