import { prisma } from "../../config/db.js";

export const findCartWithItems = async (customerId: string) => {
  return await prisma.cart.findFirst({
    where: { customerId },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });
};

export const findAddressForCustomer = async (addressId: string, customerId: string) => {
  return await prisma.address.findFirst({
    where: {
      id: addressId,
      customerId,
    },
  });
};

export const getOrderIncludeOptions = () => {
  return {
    items: {
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

export const findOrderByIdAndCustomer = async (orderId: string, customerId: string) => {
  return await prisma.order.findFirst({
    where: {
      id: orderId,
      customerId,
    },
    include: getOrderIncludeOptions(),
  });
};

export const createOrderFromCart = async (customerId: string, addressId: string, notes: string, cartItems: any[]) => {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        customerId,
        addressId,
        notes: notes || "",
        orderStatus: "pending",
      }
    });

    const orderItems = await Promise.all(
      cartItems.map(async (cartItem) => {
        return await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: cartItem.productId,
            quantity: cartItem.quantity
          }
        });
      })
    );

    await tx.cartItem.deleteMany({
      where: {
        id: {
          in: cartItems.map(item => item.id)
        }
      }
    });

    return await tx.order.findUnique({
      where: { id: order.id },
      include: getOrderIncludeOptions()
    });
  });
};

export const validateOrderStatusUpdate = (currentStatus: string, newStatus: string) => {
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

export const validateOrderCancellation = (currentStatus: string) => {
  const nonCancellableStatuses = ["delivered", "cancelled", "shipped"];
  if (nonCancellableStatuses.includes(currentStatus)) {
    return {
      valid: false,
      message: `Cannot cancel order. Order is already ${currentStatus}`
    };
  }
  return { valid: true };
};
