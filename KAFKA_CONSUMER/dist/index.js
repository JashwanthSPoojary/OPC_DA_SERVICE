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
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const kafka = new kafkajs_1.Kafka({
    clientId: "opc-consumer-minimal",
    brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
});
const consumer = kafka.consumer({ groupId: "opc-group" });
const topic = process.env.KAFKA_TOPIC || "opc-logs";
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
                yield prisma.oPCLog.create({
                    data: {
                        handle: data.handle,
                        quality: data.quality,
                        timestamp: new Date(data.timeStamp),
                        value: data.value,
                    },
                });
                console.log("Inserted 1 record");
            }),
        });
    });
}
start().catch(console.error);
