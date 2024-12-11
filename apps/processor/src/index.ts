import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "zap-app",
  brokers: ["localhost:9092"],
});

// fetch events from queue
// and then process it
// make acknowledgment
// check if the offset is start from broken evnt

const consumer = kafka.consumer({ groupId: "zap-app-test" });
const processEvents = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "zap-event", fromBeginning: true });

  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message?.value?.toString(),
      });

      await new Promise((r) => setTimeout(r, 5000)); // simulating an expensive operation

      await consumer.commitOffsets([
        { topic: topic, offset: (parseInt(message.offset) + 1).toString(), partition: partition },
      ]);
    },
  });
};

processEvents().catch((err) => console.log(err));
