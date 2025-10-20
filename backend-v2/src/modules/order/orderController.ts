import { prisma } from "../../config/db.js";
import {
  validateCreateOrder,
  validateUpdateOrderStatus,
} from "./orderValidation.js";
import {
  findCartWithItems,
  findAddressForCustomer,
  getOrderIncludeOptions,
  findOrderByIdAndCustomer,
  createOrderFromCart,
  validateOrderStatusUpdate,
  validateOrderCancellation
} from "./orderServices.js";
import type { Request, Response, NextFunction } from "express";

const getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customerId = req.customer!.id;

    const orders = await prisma.order.findMany({
      where: { customerId },
      include: getOrderIncludeOptions(),
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ orders });
  } catch (err) {
    return next(err);
  }
};

const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    const customerId = req.customer!.id;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const order = await findOrderByIdAndCustomer(orderId, customerId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ order });
  } catch (err) {
    return next(err);
  }
};

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customerId = req.customer!.id;
    const validation = validateCreateOrder(req.body);

    if (!validation.success) {
      return res
        .status(400)
        .json({ message: "Invalid input", errors: validation.errors });
    }

    const { addressId, notes } = validation.data;

    const cart = await findCartWithItems(customerId);

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const address = await findAddressForCustomer(addressId, customerId);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    const order = await createOrderFromCart(customerId, addressId, notes, cart.items);

    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (err) {
    return next(err);
  }
};

const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    const customerId = req.customer!.id;

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

    const existingOrder = await findOrderByIdAndCustomer(orderId, customerId);

    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    const statusValidation = validateOrderStatusUpdate(existingOrder.orderStatus, orderStatus);
    if (!statusValidation.valid) {
      return res.status(400).json({ message: statusValidation.message });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { orderStatus },
      include: getOrderIncludeOptions(),
    });

    return res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (err) {
    return next(err);
  }
};

const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    const customerId = req.customer!.id;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const existingOrder = await findOrderByIdAndCustomer(orderId, customerId);

    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    const cancellationValidation = validateOrderCancellation(existingOrder.orderStatus);
    if (!cancellationValidation.valid) {
      return res.status(400).json({ message: cancellationValidation.message });
    }

    const cancelledOrder = await prisma.order.update({
      where: { id: orderId },
      data: { orderStatus: "cancelled" },
      include: getOrderIncludeOptions(),
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
