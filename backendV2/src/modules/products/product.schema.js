import { z } from "zod";

export const ProductCreateSchema = z.object({
  categoryId: z.string().uuid(),
  productCollection: z.string().default("all"),
  productName: z.string().min(1),
  productDescription: z.string().min(1),
  productSlug: z.string().min(1),
  price: z.number().positive(),
  offerPrice: z.number().positive().optional(),
});

export const ProductUpdateSchema = ProductCreateSchema.partial();

// Pagination query schema for listing products
export const ProductListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
  // Optional filters: if provided, apply; if empty string, treat as undefined
  categoryId: z
    .preprocess((v) => (typeof v === "string" && v.trim() === "" ? undefined : v), z.string().uuid().optional()),
  productCollection: z
    .preprocess((v) => (typeof v === "string" && v.trim() === "" ? undefined : v), z.string().optional()),
});
