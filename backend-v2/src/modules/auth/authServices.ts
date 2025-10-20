import jwt from "jsonwebtoken";
import { prisma } from "../../config/db.js";
import { generateTokens } from "../../utils/tokenUtils.js";
import type { Customer } from "@prisma/client";

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    throw error;
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    throw error;
  }
};

export const findCustomerById = async (customerId: string) => {
  return await prisma.customer.findUnique({
    where: { id: customerId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true
    }
  });
};

export const generateNewAccessToken = (customer: { id: string; email: string }) => {
  const payload = { id: customer.id, email: customer.email };
  const { accessToken } = generateTokens(payload);
  return accessToken;
};

interface AuthResponse {
  success: boolean;
  message: string;
  action: string;
  [key: string]: any;
}

export const createAuthResponse = (success: boolean, message: string, action: string, data: Record<string, any> = {}): AuthResponse => {
  return {
    success,
    message,
    action,
    ...data
  };
};
