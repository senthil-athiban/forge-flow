import { Kafka } from "kafkajs";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();
dotenv.config();

const kafka = new Kafka({
  clientId: "zap-app",
  brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
});

const consumer = kafka.consumer({ groupId: process.env.GROUP_ID! });
const producer = kafka.producer();
const processEvents = async () => {
  await producer.connect();
  await consumer.connect();
  await consumer.subscribe({
    topic: process.env.TOPIC_NAME!,
    fromBeginning: true,
  });

  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
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
      const zapRun = await prismaClient.zapRun.findFirst({
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


      console.log('executing action : ', currAction?.actionType.name, ' with stage : ', stage);
      await new Promise((r) => setTimeout(r, 5000)); // simulating an expensive operation
      if (lastStage !== stage) {
        await producer.send({
          topic: process.env.TOPIC_NAME!,
            messages: [{value: JSON.stringify({zapRunId: zapRunId, stage: stage+1})}]
        })
      } else {
        console.log('processing done');
      }


      const res = await consumer.commitOffsets([
        {
          topic: topic,
          offset: (parseInt(message.offset) + 1).toString(),
          partition: partition,
        },
      ]);
    },
  });
};

processEvents().catch((err) => console.log(err));
