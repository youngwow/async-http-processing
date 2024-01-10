const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const Producer = require("./producer");
const consumeMessages = require("./consumeMessage");
const config = require("./config");

const producer = new Producer();
const logger = config.logger;

app.use(bodyParser.json("application/json"));

app.post("/send", async (req, res, next) => {
  if (req.body && !isNaN(parseFloat(req.body.message))){
    const number = parseFloat(req.body.message);

    logger.info(`Received valid number: ${number}`);

    try {
      await producer.publishMessage(number);

      await consumeMessages();

      const myEmitter = config.myEmitter;

      myEmitter.once('event', async (data) => {
        logger.info(`Event received with data.message: ${data.message}`)
  
        res.json({ data });
      });

    } catch (error) {
      logger.error(`Error processing messages: ${error}`);
      res.status(500).send("Internal Server Error");
    }
  } else {
    logger.error("Invalid number in req.body.message");
    res.status(400).send("Invalid number in req.body.message");
  }  
});

app.listen(config.port, () => {
  logger.info(`Server started on port ${config.port}`);
});