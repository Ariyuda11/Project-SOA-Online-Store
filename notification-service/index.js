const amqp = require('amqplib');

async function startConsumer() {
  try {
    const connection = await amqp.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();

    const queue = 'order_queue';

    await channel.assertQueue(queue, {
      durable: false
    });

    console.log('Notification Service waiting for messages...');

    channel.consume(queue, (message) => {
      if (message !== null) {
        const order = JSON.parse(message.content.toString());

        console.log('New Order Received Asynchronously:');
        console.log(order);

        channel.ack(message);
      }
    });

  } catch (error) {
    console.log('RabbitMQ error:', error.message);
    setTimeout(startConsumer, 5000);
  }
}

startConsumer();