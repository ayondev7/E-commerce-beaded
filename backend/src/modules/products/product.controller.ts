import { Request, Response } from "express";
import { prisma } from "@/lib/prisma";
import { HttpError } from "@/utils/httpError";
import { ProductCreateSchema, ProductUpdateSchema, ProductListQuerySchema } from "./product.schema";

export const createProduct = async (req: Request, res: Response) => {
  const parsed = ProductCreateSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, "Invalid product data", parsed.error.flatten());

  const images = ((req as any).uploadedImageUrls as string[]) || [];

  const data = parsed.data;

  const product = await prisma.product.create({
    data: {
      categoryId: data.categoryId,
      productCollection: data.productCollection ?? "all",
      productName: data.productName,
      productDescription: data.productDescription,
      productSlug: data.productSlug,
      price: data.price,
      ...(data.offerPrice ? { offerPrice: data.offerPrice } : {}),
      images,
    } as any,
  });

  res.status(201).json({ product });
};

export const listProducts = async (req: Request, res: Response) => {
  const parsed = ProductListQuerySchema.safeParse(req.query);
  if (!parsed.success) throw new HttpError(400, "Invalid pagination params", parsed.error.flatten());

  const { page, limit, categoryId, productCollection } = parsed.data as any;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (categoryId) where.categoryId = categoryId;
  if (productCollection) where.productCollection = productCollection;

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
      where,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  res.json({
    data: items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? page + 1 : null,
      prevPage: hasPrevPage ? page - 1 : null,
    },
  });
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
    data: ({
      ...data,
      ...(images.length ? { images } : {})
    } as any)
  });
  res.json({ product });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.product.delete({ where: { id } });
  res.status(204).send();
};
