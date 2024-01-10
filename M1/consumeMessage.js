const amqp = require("amqplib");
const config = require("./config");
const logger = config.logger;

async function consumeMessages() {
  try{
    const {exchangeName, url} = config.rabbitMQ;  
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, "direct");

    const q = await channel.assertQueue("M1", { durable: true });
    
    // return await new Promise((resolve, reject) => {
    //   channel.consume(q.queue, (msg) => {
    //     const consumedData = JSON.parse(msg.content.toString());
    //     console.log(consumedData);
    //     resolve(consumedData);
    //     channel.ack(msg);
    //   });
    // });
    const myEmitter = config.myEmitter;

    channel.consume(q.queue, (msg) => {
      try{
        let consumedData = JSON.parse(msg.content.toString());
        logger.info(`Message consumed successfully: ${consumedData.message}`);
        myEmitter.emit('event', consumedData)
        channel.ack(msg);
      } catch (error) {
        logger.error(`Error consuming message: ${error}`);
        channel.ack(msg);
        throw error;
      }
      
    });
  } catch (error) {
    logger.error(`Error consuming messages: ${error}`);
    throw error;
  }
  
}

module.exports = consumeMessages;