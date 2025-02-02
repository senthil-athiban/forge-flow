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
    const [zaps, runMetrics, latestZap, latestZapRun] =  await prismaClient.$transaction([
      prismaClient.zap.findMany({
        where: {
          userId: userId,
        },
        include: {
          zapRun: {
            include: {
              zapRunOutBox: true
            },
            orderBy: {
              createdAt: 'desc'
            },
          },
          trigger: {
            include: {
              triggerType: true,
            },
          },
          actions: {
            include: {
              actionType: true,
            },
          }
        },
      }),

      prismaClient.zapRun.aggregate({
        where: { 
          zap: { userId },
          createdAt: { 
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
          }
        },
        _count: true
      }),

      prismaClient.zap.findFirst({
        where: {
          userId: userId
        },
        orderBy: { createdAt: 'desc' }
      }),

      prismaClient.zapRun.findFirst({
        where: {
          zap: {
            userId: userId
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      })
    ]);
    return {zaps, zapRunMetrics: runMetrics._count, latestZap, latestZapRun}
  } catch (error) {
    throw new ApiError(401, "Unauthorized access");
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
