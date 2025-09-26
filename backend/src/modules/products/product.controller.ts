import { Request, Response } from "express";
import { prisma } from "@/lib/prisma";
import { HttpError } from "@/utils/httpError";
import { ProductCreateSchema, ProductUpdateSchema } from "./product.schema";

export const createProduct = async (req: Request, res: Response) => {
  const parsed = ProductCreateSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, "Invalid product data", parsed.error.flatten());

  const images = ((req as any).uploadedImageUrls as string[]) || [];

  const data = parsed.data;

  const product = await prisma.product.create({
    data: {
      productCategory: data.productCategory,
      productCollection: data.productCollection ?? "all",
      productName: data.productName,
      price: data.price,
      images,
      ownerId: req.user?.id
    }
  });

  res.status(201).json({ product });
};

export const listProducts = async (_req: Request, res: Response) => {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ products });
};

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new HttpError(404, "Product not found");
  res.json({ product });
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const parsed = ProductUpdateSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, "Invalid product data", parsed.error.flatten());

  const images = ((req as any).uploadedImageUrls as string[]) || [];

  const data = parsed.data;
  const product = await prisma.product.update({
    where: { id },
    data: {
      ...data,
      ...(images.length ? { images } : {})
    }
  });
  res.json({ product });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.product.delete({ where: { id } });
  res.status(204).send();
};
