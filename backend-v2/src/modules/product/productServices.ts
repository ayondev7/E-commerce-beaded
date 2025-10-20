import { prisma } from "../../config/db.js";
import type { Product, Category } from "@prisma/client";

type ProductWithCategory = Product & { category: Category };

export const getProductIncludeOptions = () => {
  return {
    category: true
  };
};

export const enrichProductsWithStatus = async (products: ProductWithCategory[], customerId?: string) => {
  if (!customerId) {
    return products.map(p => ({
      ...p,
      categoryName: p.category.name,
      isInCart: false,
      isInWishlist: false
    }));
  }

  const [cartItems, wishlistItems] = await Promise.all([
    prisma.cartItem.findMany({
      where: { 
        cart: {
          customerId
        }
      },
      select: { productId: true }
    }),
    prisma.wishlist.findMany({
      where: { customerId },
      select: { productId: true }
    })
  ]);

  const cartProductIds = new Set(cartItems.map(item => item.productId));
  const wishlistProductIds = new Set(wishlistItems.map(item => item.productId));

  return products.map(p => ({
    ...p,
    categoryName: p.category.name,
    isInCart: cartProductIds.has(p.id),
    isInWishlist: wishlistProductIds.has(p.id)
  }));
};

export const enrichSingleProductWithStatus = async (product: ProductWithCategory, customerId?: string) => {
  let productWithStatus: any = {
    ...product,
    categoryName: product.category.name,
    isInCart: false,
    isInWishlist: false
  };

  if (customerId) {
    const [cartItem, wishlistItem] = await Promise.all([
      prisma.cartItem.findFirst({
        where: { 
          productId: product.id,
          cart: {
            customerId
          }
        }
      }),
      prisma.wishlist.findFirst({
        where: { customerId, productId: product.id }
      })
    ]);

    productWithStatus.isInCart = !!cartItem;
    productWithStatus.isInWishlist = !!wishlistItem;
  }

  return productWithStatus;
};

export const buildProductWhereCondition = (categoryId?: string, collectionName?: string) => {
  const where: any = {};
  if (categoryId) {
    where.categoryId = categoryId;
  }
  if (collectionName) {
    where.productCollection = collectionName;
  }
  return where;
};

interface PaginationData {
  pageNum: number;
  limitNum: number;
  totalPages: number;
  skip: number;
}

export const calculatePaginationData = (page: string | number, limit: string | number, total: number): PaginationData => {
  const pageNum = Math.max(parseInt(String(page), 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(String(limit), 10) || 9, 1), 100);
  const totalPages = Math.max(Math.ceil(total / limitNum), 1);
  
  return {
    pageNum,
    limitNum,
    totalPages,
    skip: (pageNum - 1) * limitNum
  };
};
