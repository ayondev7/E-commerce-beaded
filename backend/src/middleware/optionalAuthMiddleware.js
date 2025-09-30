import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

export default async function optionalAuthMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    // If no auth header, continue without setting customer
    if (
      !authHeader ||
      typeof authHeader !== "string" ||
      !authHeader.startsWith("Bearer ")
    ) {
      req.customer = null;
      return next();
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      req.customer = null;
      return next();
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // Invalid token, continue without customer
      req.customer = null;
      return next();
    }

    const customerId = payload && payload.id;
    if (!customerId) {
      req.customer = null;
      return next();
    }

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });
    
    // Set customer if found, otherwise null
    req.customer = customer || null;
    return next();
  } catch (err) {
    // On any error, continue without customer
    req.customer = null;
    return next();
  }
}