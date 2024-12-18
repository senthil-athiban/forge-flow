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

const getUser = async (params: UserQueryParams) => {
  try {
    return await prismaClient.user.findFirst({
      where: params.where,
      select: params.select,
    });
  } catch (error) {
    throw new Error("Erro in finding user");
  }
};

export default { getUser };
