import { HttpError } from "../utils/httpError.js";

export function notFound(_req, res) {
  res.status(404).json({ message: "Not Found" });
}

export function errorHandler(err, _req, res, _next) {
  const status = err instanceof HttpError ? err.status : 500;
  const message = err.message || "Internal Server Error";
  if (status >= 500) console.error("Unhandled error:", err);
  res.status(status).json({ message, ...(err.details ? { details: err.details } : {}) });
}
