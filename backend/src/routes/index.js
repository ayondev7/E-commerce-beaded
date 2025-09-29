import { Router } from "express";
import authRoutes from "../modules/auth/authRoutes.js";
import productRoutes from "../modules/product/productRoutes.js";
import categoryRoutes from "../modules/category/categoryRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/product", productRoutes);
router.use("/category", categoryRoutes);

export default router;
