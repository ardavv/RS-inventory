dotenv.config();
const amqp = require('amqplib');

let channel;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.BROKER_URL);
    channel = await connection.createChannel();
    
    // Declare exchange for notifications
    await channel.assertExchange('notifications', 'fanout', { durable: true });

    console.log('Connected to RabbitMQ');
  } catch (err) {
    console.error('RabbitMQ connection error:', err);
  }
}

function publishNotification(message) {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
  }

  channel.publish('notifications', '', Buffer.from(JSON.stringify(message)));
}

module.exports = {
  connectRabbitMQ,
  publishNotification,
};
