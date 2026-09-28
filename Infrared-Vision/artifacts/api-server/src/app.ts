import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
      err(error) {
        return {
          type: error?.type ?? "Error",
          message: "request_failed",
        };
      },
    },
  }),
);
app.use(cors());
// Scene viewport captures are base64-encoded JSON payloads. Keep this bounded
// above the route's 8 MB image limit while avoiding an unbounded body parser.
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
