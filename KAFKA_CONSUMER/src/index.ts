import { Kafka } from "kafkajs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const kafka = new Kafka({
  clientId: "opc-consumer-minimal",
  brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
});

const consumer = kafka.consumer({ groupId: "opc-group" });
const topic = process.env.KAFKA_TOPIC || "opc-logs";

async function start() {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: false });
  console.log(`Connected to Kafka, listening to ${topic}`);

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;
      const data = JSON.parse(message.value.toString());
      await prisma.oPCLog.create({
        data: {
          handle: data.handle,
          quality: data.quality,
          timestamp: new Date(data.timeStamp),
          value: data.value,
        },
      });
      console.log("Inserted 1 record");
    },
  });
}

start().catch(console.error);
