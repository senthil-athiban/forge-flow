import { Admin, Consumer, EachMessagePayload, Kafka, Producer } from "kafkajs";
import { kafkaConfig, topicCreateAdminConfig } from "../config/kafka.config";
import {
  KafkaConsumerConfig,
  KafkaTopicConfig,
  ProducerMessage,
} from "../types/kafka";
import EventEmitter from "events";

class KafkaService extends EventEmitter {
  private static instance: KafkaService;
  private isConnected: boolean;
  private isInitialized: boolean;
  private consumers: Map<string, Consumer>;
  private producer: Producer;
  private admin: Admin;
  private kafka: Kafka;

  private reconnectAttempts: number;
  private messageQueue: Array<ProducerMessage> = [];

  private readonly MAX_RECONNECT_ATTEMPTS = 3;
  private readonly RECONNECT_INTERVAL = 5000;
  private readonly MESSAGE_BATCH_SIZE = 100;
   
  private constructor() {
    super();
    this.kafka = new Kafka({
      clientId: kafkaConfig.clientId,
      brokers: kafkaConfig.brokers,
      requestTimeout: kafkaConfig.requestTimeout,
      retry: kafkaConfig.retry,
    });
    this.isConnected = false;
    this.isInitialized = false;
    this.admin = this.kafka.admin();
    this.producer = this.kafka.producer();
    this.consumers = new Map();
    this.reconnectAttempts = 0;

    // Setup event handlers
    this.setupEventHandlers();
    this.start();
  }

  public static getInstance(): KafkaService {
    if (!this.instance) {
      console.log('creating instances');
      this.instance = new KafkaService();
    }
    return this.instance;
  }

  private setupEventHandlers(): void {
    this.producer.on("producer.connect", () => {
      console.info("Producer connected to Kafka");
      this.emit("producer.connected");
    });

    this.producer.on("producer.disconnect", () => {
      console.warn("Producer disconnected from Kafka");
      this.emit("producer.disconnected");
    });

    ["SIGTERM", "SIGINT", "SIGUSR2"].forEach((signal) => {
      process.on(signal, async () => {
        console.info(`Received ${signal}. Starting graceful shutdown...`);
        try {
          await this.shutdown();
          process.exit(0);
        } catch (error) {
          console.error("Error during shutdown:", error);
          process.exit(1);
        }
      });
    });

    process.on("uncaughtException", async (error) => {
      console.error("Uncaught Exception:", error);
      await this.shutdown();
      process.exit(1);
    });

    process.on("unhandledRejection", async (reason, promise) => {
      console.error("Unhandled Rejection:", reason);
      await this.shutdown();
      process.exit(1);
    });
  }

  public async start() {
    try {
      if (!this.isInitialized) {
        await this.admin.connect();
        this.isInitialized = true;
        this.connect();
        this.startMessageQueueProcessor();
      }
    } catch (error) {
      console.warn("Failer to start kafka service : ", error);
    }
  }

  public async connect() {
    try {
      if (!this.isConnected) {
        await this.producer.connect();
        this.isConnected = true;
        this.reconnectAttempts = 0;
        console.info("Kafka connected");
      }
    } catch (error) {
      this.isConnected = false;

      if (this.reconnectAttempts < this.MAX_RECONNECT_ATTEMPTS) {
        this.reconnectAttempts++;
        console.info(
          `Attempting to reconnect (${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS})...`
        );
        setTimeout(() => this.connect(), this.RECONNECT_INTERVAL);
      } else {
        throw new Error("Max reconnection attempts reached");
      }
    }
  }

  private async topicExists(topicName: string) {
    try {
      await this.admin.connect();
      const existingTopics = await this.admin.listTopics();
      return existingTopics.some((item) => item?.includes(topicName));
    } catch (error) {}
  }

  public async createTopics(topicsToCreate: Array<KafkaTopicConfig>) {
    try {
      await this.admin.connect();
      const filteredTopics = [];
      for (const topic of topicsToCreate) {
        const isExists = await this.topicExists(topic.topic);
        if (isExists) {
          console.warn(`${topic.topic} is alrady exists`);
        } else {
          filteredTopics.push(topic);
        }
      }
      if (filteredTopics?.length) {
        await this.admin.createTopics({
          topics: filteredTopics,
          timeout: topicCreateAdminConfig.timeout,
          waitForLeaders: topicCreateAdminConfig.waitForLeaders,
        });
      }
    } catch (error) {
      console.log(" Failed to create topics : ", error);
    } finally {
      await this.admin.disconnect();
    }
  }

  public async produceMessage(producerMessage: ProducerMessage) {
    if (!this.isInitialized) {
      throw new Error("Kafka is not initialized");
    }

    if (!this.isConnected) {
      await this.connect();
      this.isConnected = true;
    }

    try {
      this.messageQueue.push(producerMessage);

      // process the messageQueue immediately if the queue length exceeds the batch size
      if (this.messageQueue.length >= this.MESSAGE_BATCH_SIZE) {
        await this.processMessageQueue();
      }
    } catch (error) {
      console.error("Failed to produce message : ", error);
      throw error;
    }
  }

  private async processMessageQueue() {
    if (this.messageQueue.length === 0) return;
    try {
      const messages = this.messageQueue.flatMap((it) => ({
        topic: it.topic,
        messages: it.message.map((i) => ({value: JSON.stringify(i.value)}))
      }));
      console.log(' Messages to push : ', messages);
      await this.producer.sendBatch({ topicMessages: messages });
      this.messageQueue = [];
    } catch (error) {
      console.error("Failed to process message queue:", error);
      throw error;
    }
  }

  private startMessageQueueProcessor(): void {
    setInterval(async () => {
      if (this.messageQueue.length > 0) {
        await this.processMessageQueue();
      }
    }, 1000);
  }

  public async createConsumer(config: KafkaConsumerConfig) {
    try {
      const consumer = this.kafka.consumer({ groupId: config.groupId });
      await consumer.connect();
      for (const topic of config.topics) {
        await consumer.subscribe({
          fromBeginning: config.fromBeginning,
          topic: topic,
        });
      }
      this.consumers.set(config.groupId, consumer);
      return consumer;
    } catch (error) {
      console.warn("Error in creating consumer : ", error);
    }
  }

  public async startConsumer(
    groupId: string,
    messageHandler: any
  ) {
    try {
      const consumer = this.consumers.get(groupId);

      if (!consumer) {
        throw new Error(`No consumer is found with ${groupId}`);
      }

      await consumer.run({
        eachMessage: async (payload) => {
          await messageHandler(payload, consumer);
        },
      });
    } catch (error) {
      console.warn(`Error in starting consumer : ${error}`);
    }
  }

  public async stopConsumer(groupId: string) {
    const consumer = this.consumers.get(groupId);

    if (!consumer) {
      throw new Error(`No consumer is found with ${groupId}`);
    }

    try {
      await consumer.stop();
      await consumer.disconnect();
      // this.consumers.delete(groupId); // check to delete the consumer while stopping
    } catch (error) {
      console.error("Failed to stop consumer:", error);
      throw error;
    }
  }
  public async healthCheck(): Promise<boolean> {
    try {
      await this.admin.listTopics();
      return true;
    } catch (error) {
      return false;
    }
  }

  public async shutdown() {
    try {
      // process remaining message
      await this.processMessageQueue();

      // shutdown consumers
      for (const [groupId] of this.consumers) {
        await this.stopConsumer(groupId);
      }

      // shutdown producers
      if (this.producer) {
        await this.producer.disconnect();
      }

      this.isInitialized = false;
      this.isConnected = false;

      console.log("Shutting down kafka service gracefully");
    } catch (error) {
      console.warn(`Failed to shutdown kafka service`);
    }
  }
}

export default KafkaService;
