import KafkaService from "./services/kafka.service";

const main = async () => {
  // Initialize Kafka service
  const kafkaService = KafkaService.getInstance();
  await kafkaService.start();

  // Produce messages
  await kafkaService.produceMessage({
    topic: "my-topic",
    message: {
      value: { id: 2, name: "Test2" },
    },
  });

  // Create and start consumer
  await kafkaService.createConsumer({
    groupId: "my-group",
    topics: ["my-topic"],
  });

  await kafkaService.startConsumer(
    "my-group",
    async ({ topic, partition, message }) => {
      if (!message?.value) return;
      console.log("Received message:", {
        topic,
        partition,
        value: JSON.parse(message?.value?.toString()),
      });
    }
  );
};

main();
