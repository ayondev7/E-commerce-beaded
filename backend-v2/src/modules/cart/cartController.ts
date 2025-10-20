import { prisma } from "../../config/db.js";
import { validateAddToCart, validateUpdateCartItem } from "./cartValidation.js";
import {
  findCartItemByCustomerAndId,
  findExistingCartItem,
  findOrCreateCart,
  getCartIncludeOptions
} from "./cartServices.js";
import type { Request, Response, NextFunction } from "express";

const getUserCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
  } catch (err) {
    return next(err);
  }
};

const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.customer || !req.customer.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const customerId = req.customer.id;
    const validation = validateAddToCart(req.body);

    if (!validation.success) {
      return res
        .status(400)
        .json({ message: "Invalid input", errors: validation.errors });
    }

    const { productId, quantity } = validation.data;

    const existingCartItem = await findExistingCartItem(customerId, productId);

    if (existingCartItem) {
      return res
        .status(400)
        .json({ message: "Product already exists in cart" });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const cart = await findOrCreateCart(customerId);

    const cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity
      },
      include: getCartIncludeOptions(),
    });

    return res.status(201).json({
      message: "Item added to cart successfully",
      cartItem,
    });
  } catch (err) {
    return next(err);
  }
};

const updateCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cartItemId } = req.params;
    const customerId = req.customer!.id;

    if (!cartItemId) {
      return res.status(400).json({ message: "Cart item ID is required" });
    }

    const validation = validateUpdateCartItem(req.body);
    if (!validation.success) {
      return res
        .status(400)
        .json({ message: "Invalid input", errors: validation.errors });
    }

    const existingCartItem = await findCartItemByCustomerAndId(cartItemId, customerId);

    if (!existingCartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    const { quantity } = validation.data;

    if (quantity === existingCartItem.quantity) {
      return res
        .status(400)
        .json({ message: "No valid fields provided to update" });
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: getCartIncludeOptions(),
    });

    return res.status(200).json({
      message: "Cart item updated successfully",
      cartItem: updatedCartItem,
    });
  } catch (err) {
    return next(err);
  }
};

const removeFromCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.customer || !req.customer.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { cartItemId } = req.params;
    const customerId = req.customer.id;

    if (!cartItemId) {
      return res.status(400).json({ message: "Cart item ID is required" });
    }

    const existingCartItem = await findCartItemByCustomerAndId(cartItemId, customerId);

    if (!existingCartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    const deletedCartItem = await prisma.cartItem.delete({
      where: { id: cartItemId },
      include: getCartIncludeOptions(),
    });

    return res.status(200).json({
      message: "Item removed from cart successfully",
      cartItem: deletedCartItem,
    });
  } catch (err) {
    return next(err);
  }
};

const clearCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.customer || !req.customer.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const customerId = req.customer.id;

    const cart = await prisma.cart.findFirst({
      where: { customerId }
    });

    if (!cart) {
      return res.status(200).json({
        message: "Cart is already empty",
        deletedCount: 0,
      });
    }

    const deletedItems = await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return res.status(200).json({
      message: "Cart cleared successfully",
      deletedCount: deletedItems.count,
    });
  } catch (err) {
    return next(err);
  }
};

const getCartCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.customer || !req.customer.id) {
      return res.status(401).json({ message: "Authentication required" });
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
  } catch (err) {
    return next(err);
  }
};

const cartController = {
  getUserCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartCount,
};

export default cartController;
