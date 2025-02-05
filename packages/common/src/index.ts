import { discordConfig } from "./config/discord.config";
import { slackConfig } from "./config/slack.config";
import DiscordService from "./services/discord.service";
import KafkaService from "./services/kafka.service";
import SlackService from "./services/slack.service";

const main = async () => {
  // Initialize Kafka service
  const kafkaService = KafkaService.getInstance();
  await kafkaService.start();

  await kafkaService.createTopics([
    {
      topic: 'my-topic9',
      numPartitions: 1,
      replicationFactor: 1
    }
  ])

  // Produce messages
  await kafkaService.produceMessage({
    topic: "my-topic9",
    message: [
      {value: { id: 4, name: "Test4" }},
      {value: { id: 5, name: "Test5" }},
    ],
  });

  // Create and start consumer
  await kafkaService.createConsumer({
    groupId: "my-group9",
    topics: ["my-topic9"],
    fromBeginning: true
  });

  await kafkaService.startConsumer(
    "my-group9",
    async ({ topic, partition, message }:any) => {
      if (!message?.value) return;
      console.log("Received message:", {
        topic,
        partition,
        value: JSON.parse(message?.value?.toString()),
      });
    }
  );
};

export {default as KafkaService } from "./services/kafka.service";

export const kafkaService = KafkaService.getInstance();
export const discordService = DiscordService.getInstance();
export const slackService = SlackService.getInstance();
export default discordConfig;
// main();
