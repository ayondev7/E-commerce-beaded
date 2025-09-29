import express from "express";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import { env } from "./config/env.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
// app.use("/api", routes);

// Simple dummy route for quick testing
app.get("/dummy", (_req, res) => res.send("Hello from server dummy route"));

// 404 handler (only if no route matched)
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// Error handler (only if `next(err)` is called or an exception happens)
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  if (status >= 500) {
    console.error("Unhandled error:", err);
  }
  res.status(status).json({
    message,
    ...(err.details ? { details: err.details } : {})
  });
});

const port = env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
