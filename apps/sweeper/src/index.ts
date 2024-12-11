import { Kafka } from 'kafkajs';
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();
const kafka = new Kafka({
    clientId: 'zap-app',
    brokers: ['localhost:9092']
});

const producer = kafka.producer();
const main = async () => {
    await producer.connect();
    while(true) {

        const data = await client.zapRunOutBox.findMany({
            where: {},
            take: 10,
        });

        await producer.send({
            topic: 'zap-events',
            messages: data?.map((item) =>  ({value: item.id}))
        });

        await client.zapRunOutBox.deleteMany({
            where: {
                id: {
                    in: data?.map((item) => item.id)
                }
            },
        })
    }
}



main().catch(console.error)