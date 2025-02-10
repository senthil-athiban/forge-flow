import dotenv from "dotenv";
import pino from "pino";
import { prisma } from "@repo/db";
import { Action, KafkaService } from "@repo/common";
import ActionService, { ActionType } from "./services/action.service";

dotenv.config();
const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
 });

const kafkaConsumer = KafkaService.getInstance();
const actionService = ActionService.getInstance();

const parseKafkaMessage = (message: any) => {
  if (!message?.value) {
    logger.warn("Received empty kafka message");
    return null;
  }

  const messageString = message.value.toString();

  if (!messageString) {
    logger.warn("Recieved kafka message with empty value");
    return;
  }

  return JSON.parse(messageString);
};

const executeAction = async (
  currAction: Action,
  hooksData: string | any,
  metadata: string | any
) => {
  if (!currAction?.actionType) {
    logger.warn("Current action has no actionType");
    return;
  }

  try {
    // execute the action
    await actionService.executeAction(
      currAction?.actionType?.name as ActionType,
      {
        metadata: metadata,
        hooksMetadata: hooksData,
      }
    );

    // update the status in action

    await prisma.action.update({
      where: {
        id: currAction.id,
      },
      data: {
        status: "SUCCESS",
      },
    });
  } catch (error) {
    logger.error({error, actionId: currAction.id}, "Failed to execute action")
    await prisma.action.update({
      where: {
        id: currAction.id,
      },
      data: {
        status: "FAILED",
      },
    });
  }
};

const fetchZapRun = async (zapRunId: string) => {
  if (!zapRunId) return;
  return await prisma.zapRun.findFirst({
    where: {
      id: zapRunId,
    },
    include: {
      zap: {
        include: {
          actions: {
            include: {
              actionType: true,
            },
          },
        },
      },
    },
  });
};

const handleActions = async (
  { topic, partition, message }: any,
  consumer: any
) => {
  logger.info({
    partition,
    offset: message.offset,
    value: message?.value?.toString(),
  });

  // 1. parse the kafka message
  const zapRunData = parseKafkaMessage(message);
  if (!zapRunData) return;

  const { stage, zapRunId } = zapRunData;

  // 2. query the zapRun from database
  const zapRun = await fetchZapRun(zapRunId);
  const actions = zapRun?.zap.actions;
  const currAction = actions?.find((item) => item.sortingOrder === stage);

  if (!currAction?.id) {
    logger.warn(`No action found for stage ${stage}`);
    return;
  }

  const lastStage = actions?.length! - 1;
  const hooksData = zapRun?.metadata;
  const metadata = currAction?.metadata;

  // 3. process the actions ( email / slack / discord )
  await executeAction(currAction, hooksData, metadata);

  // 4. commit and produce another action if available else update the zapRunStatus
  try {
    await consumer.commitOffsets([
      {
        topic: topic,
        offset: (parseInt(message.offset) + 1).toString(),
        partition: partition,
      },
    ]);

    if (lastStage !== stage) {
        await kafkaConsumer.produceMessage({
          topic: process.env.TOPIC_NAME!,
          message: [{ value: { zapRunId: zapRunId, stage: stage + 1 } }],
        });
    } else {
      await prisma.zapRun.update({
        where: {
          id: zapRun?.id,
        },
        data: {
          status: "SUCCESS",
        },
      });
      logger.info("processing done");
    }
  } catch (error) {
    logger.error(
      { error },
      `Failed to produce zap run ${zapRunId} while performing stage ${stage + 1}`
    );
  }

}

const processEvents = async () => {
  const groupId = process.env.GROUP_ID!;
  await kafkaConsumer.createConsumer({
    groupId: groupId,
    topics: [process.env.TOPIC_NAME!],
    fromBeginning: true,
  });

  await kafkaConsumer.startConsumer(groupId, handleActions);
};

processEvents().catch((err) => console.log(err));
