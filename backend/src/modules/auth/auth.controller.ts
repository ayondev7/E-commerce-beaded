import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { env } from "@/config/env";
import { HttpError } from "@/utils/httpError";
import { SignupSchema, SigninSchema } from "./auth.schema";
import { GoogleSigninSchema } from "./auth.schema";

function signToken(payload: object, expiresIn: string | number) {
  return jwt.sign(payload, env.JWT_SECRET as jwt.Secret, { expiresIn } as jwt.SignOptions);
}

export const signup = async (req: Request, res: Response) => {
  const parsed = SignupSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, "Invalid signup data", parsed.error.flatten());

  const data = parsed.data;

  const existing = await prisma.customer.findUnique({ where: { email: data.email } });
  if (existing) throw new HttpError(409, "Email already in use");

  const hash = await bcrypt.hash(data.password, 10);

  const images = (req as any).uploadedImageUrls as string[] | undefined;
  const image = images && images.length ? images[0] : data.image ?? null;

  const user = await prisma.customer.create({
    data: {
      name: data.name ?? null,
      gender: (data as any).gender ?? null,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      phoneNumber: data.phoneNumber ?? null,
      email: data.email,
      password: hash,
      image: image ?? null,
    } as any,
  });

  const accessToken = signToken({ sub: user.id }, "3h");
  const refreshToken = signToken({ sub: user.id }, "7d");

  res.status(201).json({
    user: { id: user.id, email: user.email, name: user.name, image: user.image },
    accessToken,
    accessTokenExpiresIn: 3 * 60 * 60,
    refreshToken,
    refreshTokenExpiresIn: 7 * 24 * 60 * 60,
  });
};

export const signin = async (req: Request, res: Response) => {
  const parsed = SigninSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, "Invalid signin data", parsed.error.flatten());

  const { email, password } = parsed.data;
  const user = await prisma.customer.findUnique({ where: { email } });
  if (!user || !user.password) throw new HttpError(401, "Invalid credentials");
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new HttpError(401, "Invalid credentials");

  const accessToken = signToken({ sub: user.id }, "3h");
  const refreshToken = signToken({ sub: user.id }, "7d");

  res.json({
    user: { id: user.id, email: user.email, name: user.name, image: user.image },
    accessToken,
    accessTokenExpiresIn: 3 * 60 * 60,
    refreshToken,
    refreshTokenExpiresIn: 7 * 24 * 60 * 60,
  });
};

export const googleSignin = async (req: Request, res: Response) => {
  const parsed = GoogleSigninSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, "Invalid google signin data", parsed.error.flatten());

  const data = parsed.data;
  // sanitize
  const name = data.name.trim();
  const email = data.email.trim().toLowerCase();
  const image = (data as any).image ? (data as any).image.trim() : null;

  // ensure name mandatory
  if (!name) throw new HttpError(400, "Name is required");

  // check if customer exists
  let customer = await prisma.customer.findUnique({ where: { email } });
  
  if (!customer) {
    // create new customer (password null to indicate OAuth)
    customer = await prisma.customer.create({
      data: {
        name,
        email,
        image: image ?? null,
        password: null,
      } as any,
    });
  } else {
    if (customer.name !== name) {
      // Update the name if it's different
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: { name },
      });
    }
  }

  const accessToken = signToken({ sub: customer.id }, "3h");
  const refreshToken = signToken({ sub: customer.id }, "7d");

  res.json({ 
    user: { id: customer.id, email: customer.email, name: customer.name, image: customer.image },
    accessToken, 
    refreshToken, 
    accessTokenExpiresIn: 3 * 60 * 60, 
    refreshTokenExpiresIn: 7 * 24 * 60 * 60 
  });
};

export const me = async (req: Request, res: Response) => {
  res.json({ user: req.user || null });
};
