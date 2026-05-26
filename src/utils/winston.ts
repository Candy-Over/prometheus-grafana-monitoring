import { createLogger, transports } from "winston";
import  LokiTransport from "winston-loki";

const options = {
  transports: [
    new LokiTransport({
        host: "http://loki:3100"
    })
  ]
};

export const logger = createLogger(options);