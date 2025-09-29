import { Router } from "express";
import authRoutes from "../modules/auth/authRoutes.js";
import productRoutes from "../modules/product/productRoutes.js";
import categoryRoutes from "../modules/category/categoryRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);

export default router;
