import { z } from "zod";

// Create Product schema
export const createProductSchema = z
  .object({
    categoryId: z
      .string({ required_error: "Category ID is required" })
      .uuid({ message: "Invalid category ID" }),
    productCollection: z
      .string()
      .trim()
      .min(1, { message: "Product collection is required" })
      .default("all"),
    productName: z
      .string({ required_error: "Product name is required" })
      .trim()
      .min(1, { message: "Product name is required" }),
    productDescription: z
      .string({ required_error: "Product description is required" })
      .trim()
      .min(1, { message: "Product description is required" }),
    price: z
      .union([z.string(), z.number()])
      .transform((v) => (typeof v === "number" ? v : parseFloat(v)))
      .refine((n) => Number.isFinite(n) && n > 0, {
        message: "Price must be a positive number",
      })
      .transform((n) => n.toFixed(2)), // store as string with 2 decimals for Prisma Decimal
    offerPrice: z
      .union([z.string(), z.number()])
      .optional()
      .transform((v) =>
        v === undefined ? undefined : typeof v === "number" ? v : parseFloat(v)
      )
      .refine((n) => n === undefined || (Number.isFinite(n) && n > 0), {
        message: "Offer price must be a positive number",
      })
      .transform((n) => (n === undefined ? undefined : n.toFixed(2))),
  })
  .superRefine((data, ctx) => {
    if (data.offerPrice !== undefined) {
      const priceNum = parseFloat(data.price);
      const offerNum = parseFloat(data.offerPrice);
      if (offerNum > priceNum) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["offerPrice"],
          message: "Offer price must be less than or equal to price",
        });
      }
    }
  });

export function validateCreateProduct(data) {
  const result = createProductSchema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues.map((e) => ({ field: e.path.join('.'), message: e.message }));
    return { success: false, errors };
  }
  return { success: true, data: result.data };
}
