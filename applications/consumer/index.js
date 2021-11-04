const { Kafka } = require("kafkajs");
const WebSocket = require("ws");

const ws = new WebSocket("wss://ws.coinapi.io/v1/");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["kafka-1:9092"],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "coin-topic" });
const admin = kafka.admin();

const run = async () => {
  await admin.connect();

  await producer.connect();

  await admin.createTopics({
    waitForLeaders: true,
    topics: [{ topic: "coin-topic" }],
  });

  // Producing

  ws.on("open", function open() {
    const hello = {
      type: "hello",
      apikey: "BD0D2409-19C8-4235-9FA0-A45BDE164F5E",
      heartbeat: false,
      subscribe_data_type: ["trade"],
      subscribe_filter_symbol_id: ["COINBASE_SPOT_ETH_USD$"],
    };
    ws.send(JSON.stringify(hello));
  });

  ws.on("message", function incoming(data) {
    const coin = JSON.parse(data.toString());
    const message = {
      symbol_id: coin.symbol_id,
      price: coin.price,
      time_coinapi: coin.time_coinapi,
    };
    producer.send({
      topic: "coin-topic",
      messages: [{ value: JSON.stringify(message) }],
    });
  });

  // // Consuming
  await consumer.connect();

  await consumer.subscribe({ topic: "coin-topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        topic,
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
    },
  });
};

run().catch(console.error);
