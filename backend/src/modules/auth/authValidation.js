import { z } from "zod";

// Schema for Google sign-in payload
export const googleSignInSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .transform((s) => s.trim()),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email" })
    .transform((s) => s.trim().toLowerCase()),
  image: z
    .string()
    .url({ message: "Image must be a valid URL" })
    .optional()
    .or(z.literal(""))
    .transform((s) => (typeof s === "string" ? s.trim() : s)),
});

export function validateGoogleSignIn(data) {
  const result = googleSignInSchema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues.map((e) => e.message).join("; ");
    return { success: false, errors };
  }

  // result.data now contains sanitized values (trimmed name, lowercased email)
  return { success: true, data: result.data };
}

// Schema and validator for credential-based signup (all fields required; image excluded)
export const credentialSignupSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, { message: "Name is required" })
    .transform((s) => s.trim()),
  email: z
    .string({ required_error: "Email is required" })
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email" })
    .transform((s) => s.trim().toLowerCase()),
  gender: z.enum(["male", "female"], {
    required_error: "Gender is required",
    invalid_type_error: "Gender must be 'male' or 'female'",
  }),
  dateOfBirth: z
    .coerce.date({ required_error: "Date of birth is required" })
    .refine((d) => !Number.isNaN(d.getTime()), {
      message: "Date of birth is invalid",
    })
    .refine((d) => d <= new Date(), {
      message: "Date of birth cannot be in the future",
    }),
  phoneNumber: z
    .string({ required_error: "Phone number is required" })
    .trim()
    .regex(/^01\d{9}$/, {
      message:
        "Phone number must be 11 digits, start with 01, and contain only digits",
    }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" })
    .transform((s) => s.trim()),
});

export function validateCredentialSignup(data) {
  const result = credentialSignupSchema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues.map((e) => e.message).join("; ");
    return { success: false, errors };
  }
  return { success: true, data: result.data };
}

// Schema and validator for credential-based signin (email and password only)
export const credentialSigninSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email" })
    .transform((s) => s.trim().toLowerCase()),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" })
    .transform((s) => s.trim()),
});

export function validateCredentialSignin(data) {
  const result = credentialSigninSchema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues.map((e) => e.message).join("; ");
    return { success: false, errors };
  }
  return { success: true, data: result.data };
}
