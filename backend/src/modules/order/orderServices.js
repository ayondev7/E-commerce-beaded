import { prisma } from "../../config/db.js";

export const findCartWithProduct = async (cartId, customerId) => {
  return await prisma.cart.findFirst({
    where: {
      id: cartId,
      customerId,
    },
    include: {
      product: true,
    },
  });
};

export const findAddressForCustomer = async (addressId, customerId) => {
  return await prisma.address.findFirst({
    where: {
      id: addressId,
      customerId,
    },
  });
};

export const getOrderIncludeOptions = () => {
  return {
    cart: {
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    },
    address: true,
  };
};

export const findOrderByIdAndCustomer = async (orderId, customerId) => {
  return await prisma.order.findFirst({
    where: {
      id: orderId,
      customerId,
    },
    include: getOrderIncludeOptions(),
  });
};

export const validateOrderStatusUpdate = (currentStatus, newStatus) => {
  const nonUpdatableStatuses = ["delivered", "cancelled"];
  if (nonUpdatableStatuses.includes(currentStatus)) {
    return {
      valid: false,
      message: `Cannot update order status. Order is already ${currentStatus}`
    };
  }

  const allowedCustomerStatuses = ["cancelled"];
  if (!allowedCustomerStatuses.includes(newStatus)) {
    return {
      valid: false,
      message: "You can only cancel orders. Other status updates are handled by the system."
    };
  }

  return { valid: true };
};

export const validateOrderCancellation = (currentStatus) => {
  const nonCancellableStatuses = ["delivered", "cancelled", "shipped"];
  if (nonCancellableStatuses.includes(currentStatus)) {
    return {
      valid: false,
      message: `Cannot cancel order. Order is already ${currentStatus}`
    };
  }
  return { valid: true };
};