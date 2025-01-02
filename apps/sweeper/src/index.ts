import { Kafka } from 'kafkajs';
import { prisma } from "@repo/db";
import dotenv from "dotenv";

dotenv.config();

const kafka = new Kafka({
    clientId: 'zap-app',
    brokers: [`${process.env.KAFKA_HOST || 'kafka'}:${process.env.KAFKA_PORT || '9092'}`]
});

const producer = kafka.producer();
const main = async () => {
    await producer.connect();
    while(true) {

        const data = await prisma.zapRunOutBox.findMany({
            where: {},
            take: 10,
        });

        if(data?.length>0) console.log(' data : ', data);
        await producer.send({
            topic: process.env.TOPIC_NAME!,
            messages: data?.map((item) =>  ({value: JSON.stringify({zapRunId: item.zapRunId, stage: 0})}))
        });

        await prisma.zapRunOutBox.deleteMany({
            where: {
                id: {
                    in: data?.map((item) => item.id)
                }
            },
        })
    }
}



main().catch(console.error)