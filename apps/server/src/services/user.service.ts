import { ApiError } from "@/config/error";
import { PrismaClient } from "@prisma/client";

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

const updateUserById = async (userId: string, contentToUpdate: UserQueryUpdate) => {
  try {
    return await prismaClient.user.update({
      where: {
        id: userId
      }, data: contentToUpdate
    })
  } catch (error) {
    throw new Error("Error in updating user");
  }
}

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
}

export default { getUser, updateUserById, verifyUser };
