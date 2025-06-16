require('dotenv').config();
const mqtt = require('mqtt');

const client = mqtt.connect(process.env.MQTT_BROKER_URL);

client.on('connect', () => {
  console.log('MQTT connected');
});

client.on('error', (err) => {
  console.error('MQTT connection error:', err);
});

module.exports = client;