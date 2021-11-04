const kafka = require("kafka-node");

const client = new kafka.KafkaClient({
  kafkaHost: "kafka-1:9092,kafka-2:9092,kafka-3:9092",
});

const Producer = kafka.Producer;
const producer = new Producer(client);
const payloads = [
  { topic: "topic1", messages: "hi", partition: 2 },
  { topic: "topic2", messages: ["hello", "world"], partition: 1 },
];
const topicsToCreate = [
  {
    topic: "topic1",
    partitions: 2,
    replicationFactor: 1,
  },
  {
    topic: "topic2",
    partitions: 1,
    replicationFactor: 1,
  },
];
producer.on("ready", function () {
  producer.createTopics(topicsToCreate, (error, result) => {
    // result is an array of any errors if a given topic could not be created
    console.log("result", result);
    console.error("error", error);
    if (result) {
      producer.send(payloads, function (err, data) {
        console.log("sent");
        console.log(data);
        console.error(err);
      });
    }
  });
});
producer.on("error", function (err) {
  console.log("error");
  console.error(errror);
});

// const Consumer = kafka.Consumer;
// const consumer = new Consumer(
//   client,
//   [
//     { topic: "topic1", partition: 0 },
//     { topic: "topic2", partition: 1 },
//   ],
//   {
//     autoCommit: false,
//   }
// );
// consumer.on("message", function (message) {
//   console.log(message);
// });
