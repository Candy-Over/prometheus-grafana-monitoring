import type { NextFunction, Request, Response } from "express";
import client from "prom-client";

// Define custom metrics
const httpRequestCount = new client.Counter({
  name: "http_request_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});

const httpActiveRequests = new client.Gauge({
  name: "http_active_request",
  help: "Total number of active HTTP requests",
  // labelNames: ["method", "route", "status"] // we can pass also
})

// Histogram
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.1, 0.5, 1, 2, 5],
});

export const promMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Histogram start timer
  const end = httpRequestDuration.startTimer();
  
  // Increase Gauge here
  httpActiveRequests.inc();
  
  res.on("finish", () => {
    
    // Increment request counter
    httpRequestCount.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status: res.statusCode,
    });

    // Decrease gauge here
    httpActiveRequests.dec();

    // Histogram end timer
    end({ method: req.method, route: req.path, status: res.statusCode });
  });
  next();
};
