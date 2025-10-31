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
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ValidationError, BadRequestError, NotFoundError } from "../../utils/errors.js";
import { OrderCache, CartCache } from "../../utils/cacheHelpers.js";
import type { Request, Response } from "express";

const getUserOrders = asyncHandler(async (req: Request, res: Response) => {
  const customerId = req.customer!.id;

  const orders = await prisma.order.findMany({
    where: { customerId },
    include: getOrderIncludeOptions(),
    orderBy: { createdAt: "desc" },
  });

  return res.status(200).json({ orders });
});

const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const customerId = req.customer!.id;

  if (!orderId) {
    throw new BadRequestError("Order ID is required");
  }

  const order = await findOrderByIdAndCustomer(orderId, customerId);

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  return res.status(200).json({ order });
});

const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const customerId = req.customer!.id;
  const validation = validateCreateOrder(req.body);

  if (!validation.success) {
    throw new ValidationError("Invalid input", validation.errors);
  }

  const { addressId, notes } = validation.data;

  const cart = await findCartWithItems(customerId);

  if (!cart || !cart.items || cart.items.length === 0) {
    throw new BadRequestError("Cart is empty");
  }

  const address = await findAddressForCustomer(addressId, customerId);

  if (!address) {
    throw new NotFoundError("Address not found");
  }

  const order = await createOrderFromCart(customerId, addressId, notes, cart.items);

  await CartCache.invalidate(customerId);
  await OrderCache.invalidateUserOrders(customerId);

  return res.status(201).json({
    message: "Order created successfully",
    order,
  });
});

const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const customerId = req.customer!.id;

  if (!orderId) {
    throw new BadRequestError("Order ID is required");
  }

  const validation = validateUpdateOrderStatus(req.body);
  if (!validation.success) {
    throw new ValidationError("Invalid input", validation.errors);
  }

  const { orderStatus } = validation.data;

  const existingOrder = await findOrderByIdAndCustomer(orderId, customerId);

  if (!existingOrder) {
    throw new NotFoundError("Order not found");
  }

  const statusValidation = validateOrderStatusUpdate(existingOrder.orderStatus, orderStatus);
  if (!statusValidation.valid) {
    throw new BadRequestError(statusValidation.message!);
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { orderStatus },
    include: getOrderIncludeOptions(),
  });

  await OrderCache.invalidate(orderId, customerId);
  await OrderCache.setStatus(orderId, orderStatus);
  await OrderCache.invalidateUserOrders(customerId);

  return res.status(200).json({
    message: "Order status updated successfully",
    order: updatedOrder,
  });
});

const cancelOrder = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const customerId = req.customer!.id;

  if (!orderId) {
    throw new BadRequestError("Order ID is required");
  }

  const existingOrder = await findOrderByIdAndCustomer(orderId, customerId);

  if (!existingOrder) {
    throw new NotFoundError("Order not found");
  }

  const cancellationValidation = validateOrderCancellation(existingOrder.orderStatus);
  if (!cancellationValidation.valid) {
    throw new BadRequestError(cancellationValidation.message!);
  }

  const cancelledOrder = await prisma.order.update({
    where: { id: orderId },
    data: { orderStatus: "cancelled" },
    include: getOrderIncludeOptions(),
  });

  await OrderCache.invalidate(orderId, customerId);
  await OrderCache.setStatus(orderId, "cancelled");
  await OrderCache.invalidateUserOrders(customerId);

  return res.status(200).json({
    message: "Order cancelled successfully",
    order: cancelledOrder,
  });
});

const orderController = {
  getUserOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
};

export default orderController;
