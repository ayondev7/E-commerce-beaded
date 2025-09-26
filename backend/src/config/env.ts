import { config as dotenv } from "dotenv";
import { z } from "zod";

dotenv();

const EnvSchema = z.object({
  PORT: z.string().default("5000"),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(20, "JWT_SECRET should be a long random string"),
  JWT_EXPIRES_IN: z.string().default("3h"),
  CORS_ORIGIN: z.string().optional(),
  // ImageKit configuration (required for image uploads)
  IMAGEKIT_PUBLIC_KEY: z.string().min(1),
  IMAGEKIT_PRIVATE_KEY: z.string().min(1),
  IMAGEKIT_URL_ENDPOINT: z.string().url()
});

export const env = EnvSchema.parse(process.env);
