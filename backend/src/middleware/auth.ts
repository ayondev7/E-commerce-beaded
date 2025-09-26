import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "@/config/env";
import { prisma } from "@/lib/prisma";

const ACCESS_TOKEN_COOKIE = "accessToken";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.[ACCESS_TOKEN_COOKIE];
    if (!token) return res.status(401).json({ message: "Authentication required" });

    const payload = jwt.verify(token, env.JWT_SECRET) as { sub?: string; id?: string };
    const userId = payload.sub || payload.id;
    if (!userId) return res.status(401).json({ message: "Invalid token" });

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true } });
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const optionalAuth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.[ACCESS_TOKEN_COOKIE];
    if (!token) return next();
    const payload = jwt.verify(token, env.JWT_SECRET) as { sub?: string; id?: string };
    const userId = payload.sub || payload.id;
    if (!userId) return next();
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true } });
    req.user = user;
  } catch (_e) {
    // ignore
  } finally {
    next();
  }
};
