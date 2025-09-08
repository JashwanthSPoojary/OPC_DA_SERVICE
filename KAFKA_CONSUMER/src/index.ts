import { Kafka } from "kafkajs";
// import { PrismaClient } from "@prisma/client";
import { Server } from "socket.io";
import { createServer } from "http";
import express from 'express'

const app = express();
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

// const prisma = new PrismaClient();

const kafka = new Kafka({
  clientId: "opc-consumer-minimal",
  brokers: (process.env.KAFKA_BROKERS || "localhost:9094").split(","),
});
const consumer = kafka.consumer({ groupId: "opc-group" });
const topic = process.env.KAFKA_TOPIC || "opc-logs";

io.on("connection", (socket) => {
  console.log("a user connected");
});

async function start() {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: false });
  console.log(`Connected to Kafka, listening to ${topic}`);

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;
      const data = JSON.parse(message.value.toString());
      // await prisma.oPCLog.create({
      //   data: {
      //     handle: data.handle,
      //     quality: data.quality,
      //     timestamp: new Date(data.timeStamp),
      //     value: data.value,
      //   },
      // });
      // console.log("Inserted 1 record");
      io.emit("opc-data", {
        timestamp: data.timeStamp,
        value: data.value,
      });
    },
  });
}

start().catch(console.error);

httpServer.listen(3000, () => {
  console.log("Socket.IO server running on port 3000");
});
