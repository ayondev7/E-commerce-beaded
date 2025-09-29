import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma.js";
import { env } from "../../config/env.js";
import { SignupSchema, SigninSchema } from "./auth.schema.js";
import { GoogleSigninSchema } from "./auth.schema.js";

function signToken(payload, expiresIn) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
}

export const signup = async (req, res) => {
  console.log("Raw req.body before parsing:", req.body);
  const parsed = SignupSchema.safeParse(req.body);
  if (!parsed.success) {
    const error = new Error("Invalid signup data");
    error.status = 400;
    error.details = parsed.error.flatten();
    throw error;
  }

  const data = parsed.data;

  const existing = await prisma.customer.findUnique({ where: { email: data.email } });
  if (existing) {
    const error = new Error("Email already in use");
    error.status = 409;
    throw error;
  }

  const hash = await bcrypt.hash(data.password, 10);

  const images = req.uploadedImageUrls;
  const image = images && images.length ? images[0] : data.image ?? null;

  const user = await prisma.customer.create({
    data: {
      name: data.name ?? null,
      gender: data.gender ?? null,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      phoneNumber: data.phoneNumber ?? null,
      email: data.email,
      password: hash,
      image: image ?? null,
    },
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

export const signin = async (req, res) => {
  const parsed = SigninSchema.safeParse(req.body);
  if (!parsed.success) {
    const error = new Error("Invalid signin data");
    error.status = 400;
    error.details = parsed.error.flatten();
    throw error;
  }

  const { email, password } = parsed.data;
  const user = await prisma.customer.findUnique({ where: { email } });
  if (!user || !user.password) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

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

export const googleSignin = async (req, res) => {
  console.log("hello");
  console.log("Raw req.body before parsing:", req.body);
  const parsed = GoogleSigninSchema.safeParse(req.body);
  if (!parsed.success) {
    const error = new Error("Invalid google signin data");
    error.status = 400;
    error.details = parsed.error.flatten();
    throw error;
  }

  const data = parsed.data;
  console.log("Received data from frontend after parsing:", data);
  // sanitize
  const name = data.name.trim();
  const email = data.email.trim().toLowerCase();
  const image = data.image ? data.image.trim() : null;

  // ensure name mandatory
  if (!name) {
    const error = new Error("Name is required");
    error.status = 400;
    throw error;
  }

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
      },
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

export const me = async (req, res) => {
  res.json({ user: req.user || null });
};

export const helloWorld = async (req, res) => {
  res.json({ 
    message: "Hello World!",
    timestamp: new Date().toISOString(),
    success: true
  });
};
