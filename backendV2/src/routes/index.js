import { Router } from "express";
import productRoutes from "../modules/products/product.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";

const router = Router();

router.use("/products", productRoutes);
router.use("/auth", authRoutes);

export default router;
