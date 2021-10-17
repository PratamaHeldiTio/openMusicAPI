const amqplib = require('amqplib');

const producerService = {
  sendMessage: async (queue, message) => {
    const connection = await amqplib.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, {
      durable: true,
    });

    await channel.sendToQueue(queue, Buffer.from(message));

    setTimeout(() => {
      connection.close();
    }, 1000);
  },
};

module.exports = producerService;
