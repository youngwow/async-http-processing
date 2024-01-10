const amqp = require("amqplib");
const config = require("./config");

const logger = config.logger;

async function consumeMessages() {
  try{
    const exchangeName = config.rabbitMQ.exchangeName;
    const connection = await amqp.connect(config.rabbitMQ.url);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, "direct");

    const q = await channel.assertQueue("M2", { durable: true });

    channel.consume(q.queue, (msg) => {
      try{
        const consumedData = JSON.parse(msg.content.toString());
        logger.info(`Message consumed successfully: ${consumedData.message}`);
        setTimeout(() => {
            consumedData.message *= 2;
            logger.info(`Message processed and sent to M1: ${consumedData.message}`);
            channel.sendToQueue("M1", Buffer.from(JSON.stringify(consumedData)));
            channel.ack(msg);
          }, 5000);
      } catch (error) {
        logger.error(`Error consuming message: ${error}`);
        channel.ack(msg);
        throw error;
      }
    });
  } catch (error) {
    logger.error(`Error consuming messages: ${error}`);
  }
  
}

consumeMessages();