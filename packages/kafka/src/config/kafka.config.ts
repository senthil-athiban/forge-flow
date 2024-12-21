import { AdminConfig, KafkaConfig, KafkaTopicConfig } from "../types/kafka";
import { config } from "dotenv";
config();

export const kafkaConfig: KafkaConfig = {
  clientId: process.env.KAFKA_CLIENT_ID! || "my-app",
  brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
  requestTimeout: 30000,
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
};

export const kakfkaTopicsWithConfig: KafkaTopicConfig = {
    topic: process.env.KAFKA_TOPIC_NAME!,
    numPartitions: Number(process.env.KAFKA_PARTITIONS!) || 1,
    replicationFactor: Number(process.env.KAFKA_REPLICATIONS) || 1
}

export const topicCreateAdminConfig : AdminConfig = {
    waitForLeaders: true,
    timeout: 30000
}

export const kafkaTopicsWithConfig: Array<KafkaTopicConfig> = [
    {
      topic: 'event-1',
      numPartitions: 1,
      replicationFactor: 1,
    },
    {
      topic: 'event-2',
      numPartitions: 1,
      replicationFactor: 1,
    }
  ]