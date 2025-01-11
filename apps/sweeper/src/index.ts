import { Kafka } from "kafkajs";
import { prisma } from "@repo/db";
import dotenv from "dotenv";
import { KafkaService } from "@repo/kafka";

dotenv.config();

// const kafka = new Kafka({
//     clientId: process.env.CLIENT_ID || 'zap-app',
//     brokers: [`${process.env.KAFKA_HOST || 'kafka'}:${process.env.KAFKA_PORT || '9092'}`]
// });

const kafka = KafkaService.getInstance();
const main = async () => {
  await kafka.start();
  await kafka.createTopics([
    {
      topic: process.env.TOPIC_NAME!,
      numPartitions: 1,
      replicationFactor: 1,
    },
  ]);

  while (true) {
    const data = await prisma.zapRunOutBox.findMany({
      where: {},
      take: 10,
    });

    if (data?.length > 0) console.log(" data : ", data);
    await kafka.produceMessage({
      topic: process.env.TOPIC_NAME!,
      message: data?.map((item) => ({
        value: JSON.stringify({ zapRunId: item.zapRunId, stage: 0 }),
      })),
    });

    await prisma.zapRunOutBox.deleteMany({
      where: {
        id: {
          in: data?.map((item) => item.id),
        },
      },
    });
  }
};

main().catch(console.error);
