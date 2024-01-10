const amqp = require("amqplib");
const config = require("./config");

const logger = config.logger;

class Producer {
  channel;

  async createChannel() {
    try {
      const connection = await amqp.connect(config.rabbitMQ.url);
      this.channel = await connection.createChannel();
      logger.info("Channel created successfully");
    } catch (error) {
      logger.error(`Error creating channel: ${error}`);
      throw error;
    }
  } 

  async publishMessage(message) {
    try{
      if (!this.channel) {
        await this.createChannel();
      }
  
      const exchangeName = config.rabbitMQ.exchangeName;
      await this.channel.assertExchange(exchangeName, "direct");
  
      await this.channel.publish(
        exchangeName,
        "M2",
        Buffer.from(JSON.stringify({ message }))
      );

      logger.info("Message published successfully");
      logger.info(`The new message is sent to exchange ${exchangeName}`);

    } catch (error) {
      logger.error(`Error publishing message: ${error}`);
      throw error;
    }
  }
}

module.exports = Producer;