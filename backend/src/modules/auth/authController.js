import { prisma } from "../../config/db.js";
import {validateGoogleSignIn, validateCredentialSignup, validateCredentialSignin } from "./authValidation.js";
import { hashPassword } from "../../utils/hashPassword.js";
import processAndUploadImages from "../../utils/imageUtils.js";
import { generateTokens } from "../../utils/tokenUtils.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const googleSignin = async (req, res, next) => {
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

export const credentialSignup = async (req, res, next) => {
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

    let imageUrl = null;
    if (req.file) {
      imageUrl = await processAndUploadImages(req.file);
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

export const credentialSignin = async (req, res, next) => {
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

export const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const refreshToken = req.headers["x-refresh-token"];

    // Check if both tokens are provided
    if (!authHeader || !refreshToken) {
      return res.status(401).json({ 
        success: false, 
        message: "Access denied. Tokens missing.",
        action: "REDIRECT_TO_LOGIN"
      });
    }

    // Extract access token
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token format.",
        action: "REDIRECT_TO_LOGIN"
      });
    }

    const accessToken = authHeader.split(" ")[1];

    try {
      // Try to verify access token
      const accessPayload = jwt.verify(accessToken, process.env.JWT_SECRET);
      const customerId = accessPayload?.id;

      if (!customerId) {
        return res.status(401).json({ 
          success: false, 
          message: "Invalid access token payload.",
          action: "REDIRECT_TO_LOGIN"
        });
      }

      // Verify customer exists in database
      const customer = await prisma.customer.findUnique({
        where: { id: customerId },
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      });

      if (!customer) {
        return res.status(401).json({ 
          success: false, 
          message: "Customer not found.",
          action: "REDIRECT_TO_LOGIN"
        });
      }

      // Access token is valid and customer exists
      return res.status(200).json({ 
        success: true, 
        message: "Access granted.",
        action: "ALLOW_ACCESS",
        customer
      });

    } catch (accessTokenError) {
      // Access token is expired or invalid, check refresh token
      if (accessTokenError.name === "TokenExpiredError") {
        try {
          // Verify refresh token
          const refreshPayload = jwt.verify(refreshToken, process.env.JWT_SECRET);
          const customerId = refreshPayload?.id;

          if (!customerId) {
            return res.status(401).json({ 
              success: false, 
              message: "Invalid refresh token payload.",
              action: "REDIRECT_TO_LOGIN"
            });
          }

          // Verify customer exists
          const customer = await prisma.customer.findUnique({
            where: { id: customerId },
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          });

          if (!customer) {
            return res.status(401).json({ 
              success: false, 
              message: "Customer not found.",
              action: "REDIRECT_TO_LOGIN"
            });
          }

          // Generate new access token
          const payload = { id: customer.id, email: customer.email };
          const { accessToken: newAccessToken } = generateTokens(payload);

          return res.status(200).json({ 
            success: true, 
            message: "Access token refreshed.",
            action: "UPDATE_ACCESS_TOKEN",
            accessToken: newAccessToken,
            customer
          });

        } catch (refreshTokenError) {
          // Refresh token is also expired or invalid
          return res.status(401).json({ 
            success: false, 
            message: "Session expired. Please login again.",
            action: "REDIRECT_TO_LOGIN"
          });
        }
      } else {
        // Access token is invalid (not just expired)
        return res.status(401).json({ 
          success: false, 
          message: "Invalid access token.",
          action: "REDIRECT_TO_LOGIN"
        });
      }
    }

  } catch (err) {
    return next(err);
  }
};

export const getMyInfo = async (req, res, next) => {
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

const authController = {
  googleSignin,
  credentialSignup,
  credentialSignin,
  verifyAuth,
  getMyInfo,
};
export default authController;

