import express, { type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import routes from "./routes/index.js";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import "dotenv/config";

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : [];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", routes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Not Found" });
});

app.use(errorHandler);

const PORT = process.env.PORT;

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();
