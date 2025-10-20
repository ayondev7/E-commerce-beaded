import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
  email: string;
}

interface TokenOptions {
  accessExp?: string;
  refreshExp?: string;
  secret?: string;
}

interface TokenResult {
  accessToken: string;
  refreshToken: string;
}

export function generateTokens(payload: TokenPayload, opts: TokenOptions = {}): TokenResult {
  const {
    accessExp = "3h",
    refreshExp = "7d",
    secret = process.env.JWT_SECRET,
  } = opts;

  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }

  const accessToken = jwt.sign(payload, secret, { expiresIn: accessExp } as any);
  const refreshToken = jwt.sign(payload, secret, { expiresIn: refreshExp } as any);
  return { accessToken, refreshToken };
}

export default generateTokens;
