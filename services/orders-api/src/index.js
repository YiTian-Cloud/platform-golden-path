const express = require("express");
const { Kafka } = require("kafkajs");

const app = express();
app.use(express.json());

const SERVICE_NAME = process.env.SERVICE_NAME || "orders-api";

// --------------------
// Kafka setup
// --------------------
const kafka = new Kafka({
  clientId: SERVICE_NAME,
  brokers: ["localhost:9092"], // your local Kafka
});

const producer = kafka.producer();

// Simple in-memory idempotency store (golden path default)
const processedIds = new Set();

async function startKafka() {
  await producer.connect();
  console.log("Kafka producer connected");
}

// --------------------
// Health endpoint (golden path standard)
// --------------------
app.get("/healthz", (req, res) => {
  res.json({ status: "ok", service: SERVICE_NAME });
});

// --------------------
// Example endpoint (legacy)
// --------------------
app.get(`/${SERVICE_NAME}/example`, (req, res) => {
  res.json({
    service: SERVICE_NAME,
    message: "Hello from the golden-path scaffolded service!",
  });
});

// --------------------
// NEW: Create Order → Kafka Event
// --------------------
app.post("/orders", async (req, res) => {
  try {
    const { orderId, customerId, amount } = req.body;

    // Idempotency key (golden path enforced)
    const eventId = orderId || `order-${Date.now()}`;

    if (processedIds.has(eventId)) {
      return res.status(200).json({
        status: "duplicate_skipped",
        eventId,
      });
    }

    processedIds.add(eventId);

    const event = {
      id: eventId,
      type: "order.created",
      service: SERVICE_NAME,
      timestamp: new Date().toISOString(),
      payload: {
        customerId,
        amount,
      },
    };

    await producer.send({
      topic: "orders.events",
      messages: [
        {
          key: eventId,
          value: JSON.stringify(event),
        },
      ],
    });

    res.status(202).json({
      status: "queued",
      event,
    });
  } catch (err) {
    console.error("Failed to publish order:", err);
    res.status(500).json({ error: "failed_to_publish_order" });
  }
});

// --------------------
const port = process.env.PORT || 3000;

startKafka().then(() => {
  app.listen(port, () => {
    console.log(`${SERVICE_NAME} listening on port ${port}`);
  });
});
