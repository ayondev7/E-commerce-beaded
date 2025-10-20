import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";
import type { Request, Response, NextFunction } from "express";

export default async function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    if (
      !authHeader ||
      typeof authHeader !== "string" ||
      !authHeader.startsWith("Bearer ")
    ) {
      req.customer = undefined;
      return next();
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      req.customer = undefined;
      return next();
    }

    let payload: any;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      req.customer = undefined;
      return next();
    }

    const customerId = payload && payload.id;
    if (!customerId) {
      req.customer = undefined;
      return next();
    }

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });
    
    req.customer = customer || undefined;
    return next();
  } catch (err) {
    req.customer = undefined;
    return next();
  }
}
