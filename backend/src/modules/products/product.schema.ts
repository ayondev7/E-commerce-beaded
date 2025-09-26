import { z } from "zod";

export const ProductCreateSchema = z.object({
  productCategory: z.string().min(1),
  productCollection: z.string().default("all"),
  productName: z.string().min(1),
  price: z.number().positive(),
});

export const ProductUpdateSchema = ProductCreateSchema.partial();

export type ProductCreateInput = z.infer<typeof ProductCreateSchema>;
export type ProductUpdateInput = z.infer<typeof ProductUpdateSchema>;
