import jwt from "jsonwebtoken";

// Generate access and refresh tokens for a given payload
export function generateTokens(payload, opts = {}) {
  const {
    accessExp = "3h",
    refreshExp = "7d",
    secret = process.env.JWT_SECRET,
  } = opts;

  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }

  const accessToken = jwt.sign(payload, secret, { expiresIn: accessExp });
  const refreshToken = jwt.sign(payload, secret, { expiresIn: refreshExp });
  return { accessToken, refreshToken };
}

export default generateTokens;
