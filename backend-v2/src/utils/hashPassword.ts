import bcrypt from "bcryptjs";

const SALT_ROUNDS = parseInt("10", 10);

export const hashPassword = async (password: string): Promise<string> => {
  if (!password) throw new Error("Password is required");
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  return hash;
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export default hashPassword;
