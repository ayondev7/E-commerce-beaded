import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "@/routes";
import { env } from "@/config/env";
import { errorHandler, notFound } from "@/middleware/error";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN || true,
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api", routes);

// 404 and error handler
app.use(notFound);
app.use(errorHandler);

export default app;
