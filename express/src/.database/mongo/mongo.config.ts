import mongoose from "mongoose";
import config from "../../utils/config";
import { logger } from "../../utils/winston.createLogger";

if (!config.DB.MONGO.URI) throw new Error("URI is not found");

mongoose
  .connect(config.DB.MONGO.URI)
  .then(() => {
    logger.info("\nConnected to Mongo🍁\n");
  })
  .catch((e) => {
    logger.error(e, 'mongoDb');
  });
