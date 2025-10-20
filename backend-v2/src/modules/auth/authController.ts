import { prisma } from "../../config/db.js";
import {validateGoogleSignIn, validateCredentialSignup, validateCredentialSignin } from "./authValidation.js";
import { hashPassword } from "../../utils/hashPassword.js";
import processAndUploadImages from "../../utils/imageUtils.js";
import { generateTokens } from "../../utils/tokenUtils.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  verifyAccessToken,
  verifyRefreshToken,
  findCustomerById,
  generateNewAccessToken,
  createAuthResponse
} from "./authServices.js";
import type { Request, Response, NextFunction } from "express";

export const googleSignin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = validateGoogleSignIn(req.body);
    if (!validation.success) {
      return res
        .status(400)
        .json({ message: "Invalid input", errors: validation.errors });
    }

    const { name, email, image } = validation.data;

    let customer = await prisma.customer.findUnique({ where: { email } });

    if (!customer) {
      customer = await prisma.customer.create({
        data: { name, email, image },
      });
    }

    const payload = { id: customer.id, email: customer.email };
    const { accessToken, refreshToken } = generateTokens(payload);

    return res.json({ accessToken, refreshToken, customer });
  } catch (err) {
    return next(err);
  }
};

export const credentialSignup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = validateCredentialSignup(req.body);
    if (!validation.success) {
      return res.status(400).json({ message: "Invalid input", errors: validation.errors });
    }
    const { name, email, gender, dateOfBirth, phoneNumber, password } = validation.data;

    const existing = await prisma.customer.findUnique({ where: { email } });
    if (existing) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    const hashed = await hashPassword(password);

    let imageUrl: string | null = null;
    if (req.file) {
      const result = await processAndUploadImages(req.file);
      imageUrl = typeof result === 'string' ? result : null;
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        gender,
        dateOfBirth,
        phoneNumber,
        password: hashed,
        image: imageUrl,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

  const payload = { id: customer.id, email: customer.email };
  const { accessToken, refreshToken } = generateTokens(payload);
  return res.status(201).json({ customer, accessToken, refreshToken });
  } catch (err) {
    return next(err);
  }
};

export const credentialSignin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = validateCredentialSignin(req.body);
    if (!validation.success) {
      return res
        .status(400)
        .json({ message: "Invalid input", errors: validation.errors });
    }

    const { email, password } = validation.data;

    const customer = await prisma.customer.findUnique({ where: { email } });
    if (!customer || !customer.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const payload = { id: customer.id, email: customer.email };
    const { accessToken, refreshToken } = generateTokens(payload);

    return res.json({ accessToken, refreshToken, customer: {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      image: customer.image,
    }});
  } catch (err) {
    return next(err);
  }
};

export const guestSignin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const guestEmail = process.env.GUEST_EMAIL;
    const guestPassword = process.env.GUEST_PASSWORD;

    if (!guestEmail || !guestPassword) {
      return res.status(500).json({ message: "Guest credentials not configured" });
    }

    const customer = await prisma.customer.findUnique({ where: { email: guestEmail } });
    if (!customer || !customer.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(guestPassword, customer.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const payload = { id: customer.id, email: customer.email };
    const { accessToken, refreshToken } = generateTokens(payload);

    return res.json({ accessToken, refreshToken, customer: {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      image: customer.image,
    }});
  } catch (err) {
    return next(err);
  }
};

export const verifyAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const refreshToken = req.headers["x-refresh-token"];

    if (!authHeader || !refreshToken) {
      return res.status(401).json(createAuthResponse(false, "Access denied. Tokens missing.", "REDIRECT_TO_LOGIN"));
    }

    if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json(createAuthResponse(false, "Invalid token format.", "REDIRECT_TO_LOGIN"));
    }

    const accessToken = authHeader.split(" ")[1];

    try {
      const accessPayload: any = verifyAccessToken(accessToken);
      const customerId = accessPayload?.id;

      if (!customerId) {
        return res.status(401).json(createAuthResponse(false, "Invalid access token payload.", "REDIRECT_TO_LOGIN"));
      }

      const customer = await findCustomerById(customerId);

      if (!customer) {
        return res.status(401).json(createAuthResponse(false, "Customer not found.", "REDIRECT_TO_LOGIN"));
      }

      return res.status(200).json(createAuthResponse(true, "Access granted.", "ALLOW_ACCESS", { customer }));

    } catch (accessTokenError: any) {
      if (accessTokenError.name === "TokenExpiredError") {
        try {
          const refreshPayload: any = verifyRefreshToken(refreshToken as string);
          const customerId = refreshPayload?.id;

          if (!customerId) {
            return res.status(401).json(createAuthResponse(false, "Invalid refresh token payload.", "REDIRECT_TO_LOGIN"));
          }

          const customer = await findCustomerById(customerId);

          if (!customer) {
            return res.status(401).json(createAuthResponse(false, "Customer not found.", "REDIRECT_TO_LOGIN"));
          }

          const newAccessToken = generateNewAccessToken(customer);

          return res.status(200).json(createAuthResponse(true, "Access token refreshed.", "UPDATE_ACCESS_TOKEN", { 
            accessToken: newAccessToken, 
            customer 
          }));

        } catch (refreshTokenError) {
          return res.status(401).json(createAuthResponse(false, "Session expired. Please login again.", "REDIRECT_TO_LOGIN"));
        }
      } else {
        return res.status(401).json(createAuthResponse(false, "Invalid access token.", "REDIRECT_TO_LOGIN"));
      }
    }

  } catch (err) {
    return next(err);
  }
};

export const getMyInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = req.customer;
    if (!customer) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const customerData = await prisma.customer.findUnique({
      where: { id: customer.id },
      select: {
        id: true,
        name: true,
        gender: true,
        dateOfBirth: true,
        phoneNumber: true,
        email: true,
        providerId: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        password: false
      }
    });

    if (!customerData) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.json(customerData);
  } catch (err) {
    return next(err);
  }
};

export const updateMyInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = req.customer;
    if (!customer) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, gender, dateOfBirth, phoneNumber, email, password } = req.body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (gender !== undefined) updateData.gender = gender;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;

    if (email !== undefined) {
      if (email !== customer.email) {
        const existingCustomer = await prisma.customer.findUnique({ 
          where: { email } 
        });
        if (existingCustomer) {
          return res.status(409).json({ message: "Email is already taken" });
        }
      }
      updateData.email = email;
    }

    if (password !== undefined) {
      const hashed = await hashPassword(password);
      updateData.password = hashed;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id: customer.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        gender: true,
        dateOfBirth: true,
        phoneNumber: true,
        email: true,
        providerId: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        password: false
      }
    });

    return res.json(updatedCustomer);
  } catch (err) {
    return next(err);
  }
};

const authController = {
  googleSignin,
  credentialSignup,
  credentialSignin,
  verifyAuth,
  guestSignin,
  getMyInfo,
  updateMyInfo,
};

export default authController;
