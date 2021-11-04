const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["kafka-1:9092"],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "test-group" });
const admin = kafka.admin();

const run = async () => {
  console.log("pre admin.connect");
  await admin.connect();

  console.log("pre producer.connect");

  await producer.connect();

  console.log("pre createTopics");
  await admin.createTopics({
    waitForLeaders: true,
    topics: [{ topic: "test-topic" }],
  });
  // Producing
  console.log("pre producer.send");

  await producer.send({
    topic: "test-topic",
    messages: [{ value: "Hello KafkaJS user!" }],
  });

  // // Consuming
  console.log("pre consumer.connect");
  await consumer.connect();

  console.log("pre consumer.subscribe");

  await consumer.subscribe({ topic: "test-topic", fromBeginning: true });

  console.log("pre consumer.run");
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
