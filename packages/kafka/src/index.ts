import KafkaService from "./services/kafka.service";

const main = async () => {
  // Initialize Kafka service
  const kafkaService = KafkaService.getInstance();
  // await kafkaService.start();
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
    message: {
      value: { id: 3, name: "Test9" },
    },
  });

  // Create and start consumer
  await kafkaService.createConsumer({
    groupId: "my-group9",
    topics: ["my-topic9"],
    fromBeginning: true
  });

  await kafkaService.startConsumer(
    "my-group9",
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
