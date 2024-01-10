const EventEmitter = require('node:events');
const winston = require('winston');

module.exports = {
    rabbitMQ: {
      url: "amqp://localhost",
      exchangeName: "Exchange",
    },
    myEmitter: new EventEmitter(),
    port: 3000,
    logger: winston.createLogger({
      transports: [
        new winston.transports.Console()
      ],
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),
  };