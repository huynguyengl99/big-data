const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["kafka-1:9092"],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "test-group" });
const admin = kafka.admin();

const run = async () => {
  await admin.connect();

  await producer.connect();

  await admin.createTopics({
    waitForLeaders: true,
    topics: [{ topic: "test-topic" }],
  });
  // Producing

  for (let i = 0; i < 10; i++) {
    producer.send({
      topic: "test-topic",
      messages: [{ value: `Hello KafkaJS user number ${i}` }],
    });
  }

  // // Consuming
  await consumer.connect();

  await consumer.subscribe({ topic: "test-topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
    },
  });
};

run().catch(console.error);
