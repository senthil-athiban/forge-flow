import dotenv from "dotenv";
import { prisma } from "@repo/db";
import { processContent } from "./config/algo";
import { prepareEmail } from "./config/email";
import { sendSol } from "./config/web3";
import { sendSlackMessage } from "./config/slack";
import { discordService, KafkaService, slackService } from "@repo/common";

dotenv.config();

const kafka = KafkaService.getInstance();

const kafkaConsumer = KafkaService.getInstance();

const handleActions = async (
  { topic, partition, message }: any,
  consumer: any
) => {
  console.log({
    partition,
    offset: message.offset,
    value: message?.value?.toString(),
  });

  if (!message?.value?.toString()) return;
  const parsedValue = JSON.parse(message?.value?.toString());

  const zapRunId = parsedValue.zapRunId;
  const stage = parsedValue.stage;

  if (!zapRunId) return;
  const zapRun = await prisma.zapRun.findFirst({
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

  const actions = zapRun?.zap.actions;
  const currAction = actions?.find((item) => item.sortingOrder === stage);
  const lastStage = actions?.length! - 1;
  const hooksData = zapRun?.metadata;
  const body = currAction?.metadata;

  if (currAction?.actionType?.name === "email") {
    const data = processContent("email", body, hooksData);
    prepareEmail(data?.to, data?.content);
  }

  if (currAction?.actionType?.name === "sol") {
    const data = processContent("sol", body, hooksData);
    sendSol(data?.address, data?.amount);
  }

  if (currAction?.actionType?.name === "slack") {
    const { channelId } = body as any; // while creating zap, we'll be adding channelId in actions
    const { message } = hooksData as any; // while hitting webhooks, we r making sure to sent with message payload
    const slackWorkspaceToken = await slackService.getSlackChannelById(channelId);
    const workspaceToken = slackWorkspaceToken?.slack.workspaceToken as string;
    await slackService.sendMessage({workspaceToken, channelId, message});
  }

  if (currAction?.actionType?.name === "discord") {
    const { channelId } = body as any;
    const { message } = hooksData as any;

    const channel = await discordService.findChannelById(channelId);
    await discordService.sendMessage(
      channel?.discord.guildId!,
      channel?.channelId!,
      message
    );
  }

  if (lastStage !== stage) {
    await kafka.produceMessage({
      topic: process.env.TOPIC_NAME!,
      message: [{ value: { zapRunId: zapRunId, stage: stage + 1 } }],
    });
  } else {
    console.log("processing done");
  }

  const res = await consumer.commitOffsets([
    {
      topic: topic,
      offset: (parseInt(message.offset) + 1).toString(),
      partition: partition,
    },
  ]);
};

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
