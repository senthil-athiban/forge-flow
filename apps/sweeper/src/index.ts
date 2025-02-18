import dotenv from "dotenv";
import { prisma } from "@repo/db";
import { kafkaService } from "@repo/common";

dotenv.config();

const main = async () => {

  await kafkaService.createTopics([
    {
      topic: process.env.TOPIC_NAME!,
      numPartitions: 1,
      replicationFactor: 1,
    },
  ]);

  const stream = await prisma.zapRunOutBox.subscribe();
  
  for await (const event of stream) {

    if (event?.action === 'create') {
      const item = event?.created;

      await kafkaService.produceMessage({
        topic: process.env.TOPIC_NAME!,
        message: [{
          value: { zapRunId: item.zapRunId, stage: 0 },
        }],
      });
      
      await prisma.zapRunOutBox.delete({
        where: {
          id: item.id
        },
      });
    }
  }
};
main().catch(console.error);
