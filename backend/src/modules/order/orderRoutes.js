import { Router } from "express";
import autMiddleware from "../../middleware/authMiddleware.js";
import orderController from "./orderController.js";

const router = Router();

router.get("/get-user-orders", autMiddleware, orderController.getUserOrders);
router.get("/get-order/:orderId", autMiddleware, orderController.getOrderById);
router.post("/create-order", autMiddleware, orderController.createOrder);
router.patch("/update-order-status/:orderId", autMiddleware, orderController.updateOrderStatus);
router.patch("/cancel-order/:orderId", autMiddleware, orderController.cancelOrder);

export default router;