import { z } from "zod";

export const SignupSchema = z.object({
  name: z.string().min(1),
  gender: z.enum(["male", "female"]),
  dateOfBirth: z.string().optional().refine((v) => !v || !Number.isNaN(Date.parse(v)), { message: "Invalid date" }),
  phoneNumber: z.string().min(11),
  email: z.string().email(),
  password: z.string().min(6),
  image: z.string().url().optional(),
});

export const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Google specific schemas - simpler payloads from OAuth provider
export const GoogleSignupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  image: z.string().url().optional(),
});

export const GoogleSigninSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});
