const dotenv = require("dotenv");
dotenv.config();

const amqp = require('amqplib');
const mqtt = require("mqtt");

const AMQP_BROKER = process.env.AMQP_BROKER_URL || "amqp://localhost:5672";
const MQTT_BROKER = process.env.MQTT_BROKER_URL || "mqtt://localhost:1883";
const MQTT_TOPIC = "notification";

/*
    MQTT Init
*/
const mqttClient = mqtt.connect(MQTT_BROKER);
mqttClient.on("connect", () => console.log("Connected to MQTT broker"));
mqttClient.on("error", (err) => console.error("MQTT connection error:", err));

/*
    AMQP Init
*/
let channel; // Untuk menyimpan channel
async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(AMQP_BROKER);
    channel = await connection.createChannel();
    await channel.assertExchange('notifications', 'fanout', { durable: true }); // Fanout exchange
    console.log('Connected to RabbitMQ');
  } catch (err) {
    console.error('RabbitMQ connection error:', err);
  }
}

/*
    Functionality
*/
function publishNotification(message) {
  const payload = JSON.stringify(message);
  // AMQP
  try {
    if (!channel) throw new Error('RabbitMQ channel not connected!'); // Cek koneksi
    channel.publish(
      'notifications',
      '',
      Buffer.from(payload),
      {persistent: true,}
    );
    console.log("Published to RabbitMQ (AMQP): ", payload);
  } catch (err) {
    console.error('AMQP publish failed!: ', err);
  }
  // MQTT
  try {
    if (!mqttClient.connected) throw new Error("MQTT client not connected!"); // Cek koneksi
    mqttClient.publish(MQTT_TOPIC, payload);
    console.log("Published to MQTT:", payload);
  } catch (err) {
    console.error("MQTT publish failed:", err);
  }
}

module.exports = {
  connectRabbitMQ,
  publishNotification,
};
