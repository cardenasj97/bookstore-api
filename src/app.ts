import "dotenv/config";
import "express-async-errors";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middleware/error.js";
import { authorRouter } from "./routes/author.routes.js";
import { categoryRouter } from "./routes/category.routes.js";
import { bookRouter } from "./routes/book.routes.js";
import { logger } from "./lib/logger.js";
import { pinoHttp } from "pino-http";
import { randomUUID } from "node:crypto";

export const app = express();

app.use(
  pinoHttp({
    logger: logger as any,
    genReqId: (req, res) => {
      const existing = req.id ?? req.headers["x-request-id"];
      const id = existing || randomUUID();
      res.setHeader("x-request-id", id.toString());
      return id;
    },
    customLogLevel: (res, err) => {
      if (err || (res.statusCode && res.statusCode >= 500)) return "error";
      if (res.statusCode && res.statusCode >= 400) return "warn";
      return "info";
    },
    customSuccessMessage: (req, res) => {
      return `${req.method} ${req.url} → ${res.statusCode}`;
    },
    customReceivedMessage: (req) => `➡️  ${req.method} ${req.url}`,
    customErrorMessage: (req, res, err) =>
      `❌ ${req.method} ${req.url} failed: ${err.message}`,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url };
      },
    },
  })
);

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/authors", authorRouter);
app.use("/categories", categoryRouter);
app.use("/books", bookRouter);

// error handler last
app.use(errorHandler);
