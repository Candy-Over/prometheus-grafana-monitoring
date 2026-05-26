## Links

**Grafana Documentation:** https://grafana.com/tutorials/grafana-fundamentals/#introduction

### Prometheus:

**Prometheus** is a monitoring system and time-series database. It acts as a data engine, actively scraping metrics from your servers, databases, and applications at regular intervals.

- **How it works:** It uses a pull model, gathering data from configured endpoints (called "exporters") and storing them over time.
- **PromQL:** It uses its own query language, PromQL, to filter and aggregate this data.
- **Alerting:** It can evaluate thresholds and trigger alerts when something goes wrong (e.g., server running out of disk space).
- How to use prom-client

  ```bash
  npm i prom-client
  ```

  middleware:

  ```jsx
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

  ```

  ### Expose /metrics endpoint:

  ```jsx
  // Expose metrics endpoint
  app.get("/metrics", async (req, res) => {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
  });
  ```

### Grafana:

**Grafana** is an analytics and visualization platform. Because Prometheus focuses purely on data collection and storage, it relies on Grafana to provide the user interface.

- **How it works:** You connect Prometheus as a "data source" in Grafana. Grafana then pulls the metrics and displays them on highly customizable charts, graphs, and heatmaps.
- **Multi-source Integration:** Grafana is highly versatile; it doesn't just work with Prometheus. You can feed it data from other platforms like Elasticsearch, InfluxDB, or cloud providers.

<img src="" />
