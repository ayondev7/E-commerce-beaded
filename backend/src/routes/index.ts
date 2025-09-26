import { Router, Request, Response } from "express";
import productRoutes from "@/modules/products/product.routes";
import authRoutes from "@/modules/auth/auth.routes";

const router = Router();

router.get("/health", (_req: Request, res: Response) => res.json({ ok: true }));
router.use("/products", productRoutes);
router.use("/auth", authRoutes);

export default router;
