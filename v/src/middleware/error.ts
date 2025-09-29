import { Request, Response, NextFunction } from "express";
import { HttpError } from "@/utils/httpError";

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ message: "Not Found" });
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err instanceof HttpError ? err.status : 500;
  const message = err.message || "Internal Server Error";
  if (status >= 500) console.error("Unhandled error:", err);
  res.status(status).json({ message, ...(err.details ? { details: err.details } : {}) });
}
