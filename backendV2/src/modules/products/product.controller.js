import { prisma } from "../../lib/prisma.js";
import { ProductCreateSchema, ProductUpdateSchema, ProductListQuerySchema } from "./product.schema.js";

export const createProduct = async (req, res) => {
  const parsed = ProductCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    const error = new Error("Invalid product data");
    error.status = 400;
    error.details = parsed.error.flatten();
    throw error;
  }

  const images = req.uploadedImageUrls || [];

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
    },
  });

  res.status(201).json({ product });
};

export const listProducts = async (req, res) => {
  const parsed = ProductListQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    const error = new Error("Invalid pagination params");
    error.status = 400;
    error.details = parsed.error.flatten();
    throw error;
  }

  const { page, limit, categoryId, productCollection } = parsed.data;
  const skip = (page - 1) * limit;

  const where = {};
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

export const getProduct = async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    const error = new Error("Product not found");
    error.status = 404;
    throw error;
  }
  res.json({ product });
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const parsed = ProductUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    const error = new Error("Invalid product data");
    error.status = 400;
    error.details = parsed.error.flatten();
    throw error;
  }

  const images = req.uploadedImageUrls || [];

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

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  await prisma.product.delete({ where: { id } });
  res.status(204).send();
};
