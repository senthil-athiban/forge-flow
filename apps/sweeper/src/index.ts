import dotenv from "dotenv";
import { prisma } from "@repo/db";
import { KafkaService } from "@repo/common";

dotenv.config();
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

    if (data?.length > 0) {
      console.log(" data : ", data);

      await kafka.produceMessage({
        topic: process.env.TOPIC_NAME!,
        message: data?.map((item) => ({
          value: { zapRunId: item.zapRunId, stage: 0 },
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
  }
};
main().catch(console.error);
