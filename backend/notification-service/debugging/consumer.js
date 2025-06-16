// consumer.js
dotenv.config();
const amqp = require('amqplib');

async function startConsumer() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertExchange('notifications', 'fanout', { durable: true });

  // Create a random, exclusive queue for each consumer
  const q = await channel.assertQueue('', { exclusive: true });
  await channel.bindQueue(q.queue, 'notifications', '');

  console.log('Waiting for notifications...');

  channel.consume(q.queue, (msg) => {
    if (msg.content) {
      console.log('Notification received:', msg.content.toString());
    }
  }, { noAck: true });
}

startConsumer();