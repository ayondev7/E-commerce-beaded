import { prisma } from "../../config/db.js";
import {validateGoogleSignIn, validateCredentialSignup, validateCredentialSignin } from "./authValidation.js";
import { hashPassword } from "../../utils/hashPassword.js";
import processAndUploadImages from "../../utils/imageUtils.js";
import { generateTokens } from "../../utils/tokenUtils.js";
import bcrypt from "bcryptjs";

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

export const getMyInfo = async (req, res, next) => {
  try {
    const customer = req.customer;
    if (!customer) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.json({ name: customer.name, image: customer.image });
  } catch (err) {
    return next(err);
  }
};

const authController = {
  googleSignin,
  credentialSignup,
  credentialSignin,
  getMyInfo,
};
export default authController;

