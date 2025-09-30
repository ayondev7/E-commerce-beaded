import { prisma } from "../../config/db.js";
import {
  validateCreateOrder,
  validateUpdateOrderStatus,
} from "./orderValidation.js";

const getUserOrders = async (req, res, next) => {
  try {
    const customerId = req.customer.id;

    const orders = await prisma.order.findMany({
      where: { customerId },
      include: {
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
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ orders });
  } catch (err) {
    return next(err);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const customerId = req.customer.id;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        customerId,
      },
      include: {
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
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ order });
  } catch (err) {
    return next(err);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const customerId = req.customer.id;
    const validation = validateCreateOrder(req.body);

    if (!validation.success) {
      return res
        .status(400)
        .json({ message: "Invalid input", errors: validation.errors });
    }

    const { cartId, addressId, notes } = validation.data;

    // Check if cart exists and belongs to the customer
    const cart = await prisma.cart.findFirst({
      where: {
        id: cartId,
        customerId,
      },
      include: {
        product: true,
      },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Check if address exists and belongs to the customer
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        customerId,
      },
    });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        customerId,
        cartId,
        addressId,
        notes: notes || "",
        orderStatus: "pending",
      },
      include: {
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
      },
    });
    try {
      await prisma.cart.update({
        where: { id: cartId },
        data: { isInOrderList: true },
      });
      const refreshedOrder = await prisma.order.findUnique({
        where: { id: order.id },
        include: {
          cart: {
            include: {
              product: {
                include: { category: true },
              },
            },
          },
          address: true,
        },
      });

      return res.status(201).json({
        message: "Order created successfully",
        order: refreshedOrder,
      });
    } catch (updateErr) {
      return res.status(201).json({
        message: "Order created successfully (but failed to update cart)",
        order,
        warning: updateErr.message,
      });
    }
  } catch (err) {
    return next(err);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const customerId = req.customer.id;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const validation = validateUpdateOrderStatus(req.body);
    if (!validation.success) {
      return res
        .status(400)
        .json({ message: "Invalid input", errors: validation.errors });
    }

    const { orderStatus } = validation.data;

    // Check if order exists and belongs to the customer
    const existingOrder = await prisma.order.findFirst({
      where: {
        id: orderId,
        customerId,
      },
    });

    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the order can be updated (not already delivered or cancelled)
    if (
      existingOrder.orderStatus === "delivered" ||
      existingOrder.orderStatus === "cancelled"
    ) {
      return res.status(400).json({
        message: `Cannot update order status. Order is already ${existingOrder.orderStatus}`,
      });
    }

    // Prevent customers from updating certain statuses (only allow cancellation)
    const allowedCustomerStatuses = ["cancelled"];
    if (!allowedCustomerStatuses.includes(orderStatus)) {
      return res.status(403).json({
        message:
          "You can only cancel orders. Other status updates are handled by the system.",
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { orderStatus },
      include: {
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
      },
    });

    return res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (err) {
    return next(err);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const customerId = req.customer.id;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    // Check if order exists and belongs to the customer
    const existingOrder = await prisma.order.findFirst({
      where: {
        id: orderId,
        customerId,
      },
    });

    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the order can be cancelled
    const nonCancellableStatuses = ["delivered", "cancelled", "shipped"];
    if (nonCancellableStatuses.includes(existingOrder.orderStatus)) {
      return res.status(400).json({
        message: `Cannot cancel order. Order is already ${existingOrder.orderStatus}`,
      });
    }

    const cancelledOrder = await prisma.order.update({
      where: { id: orderId },
      data: { orderStatus: "cancelled" },
      include: {
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
      },
    });

    return res.status(200).json({
      message: "Order cancelled successfully",
      order: cancelledOrder,
    });
  } catch (err) {
    return next(err);
  }
};

const orderController = {
  getUserOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
};

export default orderController;
