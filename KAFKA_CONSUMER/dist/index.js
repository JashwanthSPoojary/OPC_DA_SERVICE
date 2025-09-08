"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
// import { PrismaClient } from "@prisma/client";
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)();
const io = new socket_io_1.Server(httpServer, {
    cors: { origin: "*" },
});
// const prisma = new PrismaClient();
const kafka = new kafkajs_1.Kafka({
    clientId: "opc-consumer-minimal",
    brokers: (process.env.KAFKA_BROKERS || "localhost:9094").split(","),
});
const consumer = kafka.consumer({ groupId: "opc-group" });
const topic = process.env.KAFKA_TOPIC || "opc-logs";
io.on("connection", (socket) => {
    console.log("a user connected");
});
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        yield consumer.connect();
        yield consumer.subscribe({ topic, fromBeginning: false });
        console.log(`Connected to Kafka, listening to ${topic}`);
        yield consumer.run({
            eachMessage: (_a) => __awaiter(this, [_a], void 0, function* ({ message }) {
                if (!message.value)
                    return;
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
            }),
        });
    });
}
start().catch(console.error);
httpServer.listen(3000, () => {
    console.log("Socket.IO server running on port 3000");
});
