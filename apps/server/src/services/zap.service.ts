import { ApiError } from "../config/error";
import { prismaClient } from "../db/index";
import { ZapType } from "../schema/index";

const createZap = async (body: ZapType, userId: string) => {
  const { triggerTypeId, actions } = body;
  const zapRun = await prismaClient.$transaction(async (tx: any) => {
    const zap = await tx.zap.create({
      data: {
        userId: userId,
        actions: {
          create: actions.map((it: any, index: number) => ({
            actionTypeId: it.actionTypeId,
            metadata: it.actionMetaData,
            sortingOrder: index,
          })),
        },
      },
    });

    const trigger = await tx.trigger.create({
      data: {
        triggerTypeId: triggerTypeId,
        zapId: zap.id,
      },
    });

    return zap;
  });
  return zapRun;
};

const getZapByUserId = async (userId: string) => {
  try {
    const zap = await prismaClient.zap.findMany({
      where: {
        userId: userId,
      },
      include: {
        trigger: {
          include: {
            triggerType: true,
          },
        },
        actions: {
          include: {
            actionType: true,
          },
        },
      },
    });
    return zap;
  } catch (error) {
    throw new ApiError(401, "Un authorized");
  }
};

const getZapById = async (userId: string, zapId: string) => {
    try {
        return await prismaClient.zap.findFirst({
            where: {
                userId: userId,
                id: zapId
            },
            include: {
                trigger: {
                    include: {
                        triggerType: true
                    }
                },
                actions: {
                    include: {
                        actionType: true
                    }
                }
            }
        });
    } catch (error) {
        throw new ApiError(401, "Un authorized");
    }
}

export default { createZap, getZapByUserId, getZapById };
