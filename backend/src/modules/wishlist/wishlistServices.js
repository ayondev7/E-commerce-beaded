import { prisma } from "../../config/db.js";

export const getWishlistIncludeOptions = () => {
  return {
    product: {
      include: {
        category: true
      }
    }
  };
};

export const enrichWishlistWithCartStatus = async (wishlistItems, customerId) => {
  const cartItems = await prisma.cart.findMany({
    where: { customerId },
    select: { productId: true }
  });

  const cartProductIds = new Set(cartItems.map(item => item.productId));

  return wishlistItems.map(item => ({
    ...item,
    product: {
      ...item.product,
      isInCart: cartProductIds.has(item.productId)
    }
  }));
};

export const findExistingWishlistItem = async (customerId, productId) => {
  return await prisma.wishlist.findFirst({
    where: { 
      customerId,
      productId 
    }
  });
};

export const findWishlistItemByIdAndCustomer = async (wishlistItemId, customerId) => {
  return await prisma.wishlist.findFirst({
    where: { 
      id: wishlistItemId,
      customerId 
    }
  });
};