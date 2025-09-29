import { Router, Request, Response } from "express";
import productRoutes from "@/modules/products/product.routes";
import authRoutes from "@/modules/auth/auth.routes";

const router = Router();

router.use("/products", productRoutes);
router.use("/auth", authRoutes);

export default router;
