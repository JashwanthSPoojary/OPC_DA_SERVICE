```mermaid
graph TD
    A[C# OPC_DA_BRIDGE <br/>(Kafka Producer)] --> B[Kafka Broker <br/>(Docker Container)]
    B --> C[Node.js Kafka Consumer <br/>+ Prisma ORM + PostgreSQL]



Add ons : 
1. Batching , validation , Error handling
