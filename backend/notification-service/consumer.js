/* 
    Consumer testing  
    -> Untuk keperluan debugging
*/
const dotenv = require("dotenv");
dotenv.config();
const amqp = require('amqplib');

async function startConsumer() {
  try {
    const connection = await amqp.connect('amqp://localhost'); // or use process.env.BROKER_URL
    const channel = await connection.createChannel();

    const exchangeName = 'notifications';

    // Ensure the exchange exists
    await channel.assertExchange(exchangeName, 'fanout', { durable: true });

    // Create an exclusive, auto-delete queue (temporary, good for testing)
    const { queue } = await channel.assertQueue('', { exclusive: true });

    // Bind the queue to the exchange
    await channel.bindQueue(queue, exchangeName, '');

    console.log(` [*] Waiting for messages in queue: ${queue}. To exit press CTRL+C`);

    channel.consume(queue, (msg) => {
      if (msg.content) {
        console.log('Received:', msg.content.toString());
      }
    }, { noAck: true }); // auto-acknowledge

  } catch (err) {
    console.error('RabbitMQ Consumer error:', err);
  }
}

startConsumer();
