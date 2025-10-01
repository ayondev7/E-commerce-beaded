import { prisma } from "../../config/db.js";

export const calculateCartItemPrices = (product, quantity) => {
  const price = parseFloat(product.price);
  const offerPrice = product.offerPrice ? parseFloat(product.offerPrice) : null;
  const effectivePrice = offerPrice || price;
  const discount = offerPrice ? (price - offerPrice) * quantity : 0;
  const subTotal = effectivePrice * quantity;
  const deliveryFee = 60.0;
  const grandTotal = subTotal + deliveryFee;

  return {
    subTotal,
    deliveryFee,
    discount,
    grandTotal
  };
};

export const findCartItemByCustomerAndId = async (cartItemId, customerId) => {
  return await prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      cart: {
        customerId
      }
    },
    include: {
      product: true,
      cart: true
    },
  });
};

export const findExistingCartItem = async (customerId, productId) => {
  return await prisma.cartItem.findFirst({
    where: {
      productId,
      cart: {
        customerId
      }
    },
  });
};

export const findOrCreateCart = async (customerId) => {
  let cart = await prisma.cart.findFirst({
    where: { customerId }
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { customerId }
    });
  }

  return cart;
};

export const getCartIncludeOptions = () => {
  return {
    product: {
      include: {
        category: true,
      },
    },
  };
};