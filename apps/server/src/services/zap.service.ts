import { prismaClient } from "@/db";
import { ZapType } from "@/schema";

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

export default { createZap };
