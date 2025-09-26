import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { env } from "@/config/env";
import { HttpError } from "@/utils/httpError";

const COOKIE_NAME = "accessToken";

export const signup = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  if (!email || !password) throw new HttpError(400, "Email and password required");
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new HttpError(409, "Email already in use");
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hash, name } });
  const token = jwt.sign(
    { sub: user.id },
    env.JWT_SECRET as jwt.Secret,
    { expiresIn: env.JWT_EXPIRES_IN as unknown as jwt.SignOptions["expiresIn"] }
  );
  res
    .cookie(COOKIE_NAME, token, cookieOptions())
    .status(201)
    .json({ user: { id: user.id, email: user.email, name: user.name } });
};

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) throw new HttpError(400, "Email and password required");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new HttpError(401, "Invalid credentials");
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new HttpError(401, "Invalid credentials");
  const token = jwt.sign(
    { sub: user.id },
    env.JWT_SECRET as jwt.Secret,
    { expiresIn: env.JWT_EXPIRES_IN as unknown as jwt.SignOptions["expiresIn"] }
  );
  res.cookie(COOKIE_NAME, token, cookieOptions()).json({ user: { id: user.id, email: user.email, name: user.name } });
};

export const me = async (req: Request, res: Response) => {
  res.json({ user: req.user || null });
};

export const signout = async (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME, cookieOptions()).status(204).send();
};

function cookieOptions() {
  const isProd = env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000
  } as const;
}
