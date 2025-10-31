import { prisma } from "../../config/db.js";
import { validateAddToCart, validateUpdateCartItem } from "./cartValidation.js";
import {
  findCartItemByCustomerAndId,
  findExistingCartItem,
  getCartIncludeOptions
} from "./cartServices.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ValidationError, UnauthorizedError, BadRequestError, NotFoundError } from "../../utils/errors.js";
import { CartCache, ProductCache } from "../../utils/cacheHelpers.js";
import type { Request, Response } from "express";

const getUserCart = asyncHandler(async (req: Request, res: Response) => {
  const customerId = req.customer!.id;

  const cart = await prisma.cart.findFirst({
    where: { customerId },
    include: {
      items: {
        include: getCartIncludeOptions(),
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!cart) {
    return res.status(200).json({ cartItems: [] });
  }

  return res.status(200).json({ cartItems: cart.items });
});

const addToCart = asyncHandler(async (req: Request, res: Response) => {
  if (!req.customer || !req.customer.id) {
    throw new UnauthorizedError("Authentication required");
  }

  const customerId = req.customer.id;
  const validation = validateAddToCart(req.body);

  if (!validation.success) {
    throw new ValidationError("Invalid input", validation.errors);
  }

  const { productId, quantity } = validation.data;

  const existingCartItem = await findExistingCartItem(customerId, productId);

  if (existingCartItem) {
    throw new BadRequestError("Product already exists in cart");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (!product) {
    throw new NotFoundError("Product not found");
  }

  const cartItem = await prisma.$transaction(async (tx) => {
    let cart = await tx.cart.findFirst({
      where: { customerId }
    });

    if (!cart) {
      cart = await tx.cart.create({
        data: { customerId }
      });
    }

    return await tx.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity
      },
      include: getCartIncludeOptions(),
    });
  });

  await CartCache.invalidate(customerId);
  await ProductCache.invalidateLists();

  return res.status(201).json({
    message: "Item added to cart successfully",
    cartItem,
  });
});

const updateCartItem = asyncHandler(async (req: Request, res: Response) => {
  const { cartItemId } = req.params;
  const customerId = req.customer!.id;

  if (!cartItemId) {
    throw new BadRequestError("Cart item ID is required");
  }

  const validation = validateUpdateCartItem(req.body);
  if (!validation.success) {
    throw new ValidationError("Invalid input", validation.errors);
  }

  const existingCartItem = await findCartItemByCustomerAndId(cartItemId, customerId);

  if (!existingCartItem) {
    throw new NotFoundError("Cart item not found");
  }

  const { quantity } = validation.data;

  if (quantity === existingCartItem.quantity) {
    throw new BadRequestError("No valid fields provided to update");
  }

  const updatedCartItem = await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
    include: getCartIncludeOptions(),
  });

  await CartCache.invalidate(customerId);

  return res.status(200).json({
    message: "Cart item updated successfully",
    cartItem: updatedCartItem,
  });
});

const removeFromCart = asyncHandler(async (req: Request, res: Response) => {
  if (!req.customer || !req.customer.id) {
    throw new UnauthorizedError("Authentication required");
  }

  const { cartItemId } = req.params;
  const customerId = req.customer.id;

  if (!cartItemId) {
    throw new BadRequestError("Cart item ID is required");
  }

  const existingCartItem = await findCartItemByCustomerAndId(cartItemId, customerId);

  if (!existingCartItem) {
    throw new NotFoundError("Cart item not found");
  }

  const deletedCartItem = await prisma.cartItem.delete({
    where: { id: cartItemId },
    include: getCartIncludeOptions(),
  });

  await CartCache.invalidate(customerId);
  await ProductCache.invalidateLists();

  return res.status(200).json({
    message: "Item removed from cart successfully",
    cartItem: deletedCartItem,
  });
});

const clearCart = asyncHandler(async (req: Request, res: Response) => {
  if (!req.customer || !req.customer.id) {
    throw new UnauthorizedError("Authentication required");
  }

  const customerId = req.customer.id;

  const result = await prisma.$transaction(async (tx) => {
    const cart = await tx.cart.findFirst({
      where: { customerId }
    });

    if (!cart) {
      return { deletedCount: 0 };
    }

    const deletedItems = await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return { deletedCount: deletedItems.count };
  });

  await CartCache.invalidate(customerId);

  if (result.deletedCount === 0) {
    return res.status(200).json({
      message: "Cart is already empty",
      deletedCount: 0,
    });
  }

  return res.status(200).json({
    message: "Cart cleared successfully",
    deletedCount: result.deletedCount,
  });
});

const getCartCount = asyncHandler(async (req: Request, res: Response) => {
  if (!req.customer || !req.customer.id) {
    throw new UnauthorizedError("Authentication required");
  }

  const customerId = req.customer.id;

  const cart = await prisma.cart.findFirst({
    where: { customerId }
  });

  if (!cart) {
    return res.status(200).json({ count: 0 });
  }

  const count = await prisma.cartItem.count({
    where: { cartId: cart.id }
  });

  return res.status(200).json({ count });
});

const cartController = {
  getUserCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartCount,
};

export default cartController;
