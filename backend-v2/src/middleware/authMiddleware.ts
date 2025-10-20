import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";
import type { Request, Response, NextFunction } from "express";
import type { Customer } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      customer?: Customer;
    }
  }
}

export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (
      !authHeader ||
      typeof authHeader !== "string" ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    let payload: any;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const customerId = payload && payload.id;
    if (!customerId) return res.status(401).json({ message: "Unauthorized" });

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });
    if (!customer) return res.status(401).json({ message: "Unauthorized" });

    req.customer = customer;
    return next();
  } catch (err) {
    return next(err);
  }
}
