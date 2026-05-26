import "dotenv/config";
import express from "express";
import { promMiddleware } from "./middleware/promMiddleware.js";
import client from "prom-client";
import { logger } from "./utils/winston.js";

const app = express();
const PORT = process.env.PORT || 8000;

// Prometheus middleware
app.use(promMiddleware);

app.get("/", (_, res) => {
  logger.info("Request to / route");
  return res.send("Hello World");
});

// Dynamic route
app.get("/user/:id", (req, res) => {
  return res.send(`User id: ${req.params.id}`);
});

// Slow route
app.get("/slow", async (_, res) => {
  const time = Math.random() * 1000;
  await new Promise((r) => setTimeout(r, Math.random() * 1000));
  logger.info("Request to /slow route");
  return res.send(`Request process taken ${time}`);
});

// Active route
app.get("/active", async (_, res) => {
  await new Promise((r) => setTimeout(r, 1000));
  logger.info("Request to /active route");
  return res.send("Active request ended");
});

// Error route
app.get("/random-error", (_, res) => {
  try {
    if (Math.random() < 0.5) {
      throw new Error("Error occurred in /random-error route");
    }
    logger.info("Request came to /random-error");
    return res.send("No error came");
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    }
    return res.status(400).send("Error");
  }
});

// Expose metrics endpoint
app.get("/metrics", async (_, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
