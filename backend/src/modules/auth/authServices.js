import jwt from "jsonwebtoken";
import { prisma } from "../../config/db.js";
import { generateTokens } from "../../utils/tokenUtils.js";

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw error;
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw error;
  }
};

export const findCustomerById = async (customerId) => {
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

export const generateNewAccessToken = (customer) => {
  const payload = { id: customer.id, email: customer.email };
  const { accessToken } = generateTokens(payload);
  return accessToken;
};

export const createAuthResponse = (success, message, action, data = {}) => {
  return {
    success,
    message,
    action,
    ...data
  };
};