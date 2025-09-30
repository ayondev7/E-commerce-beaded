import { Router } from "express";
import authRoutes from "../modules/auth/authRoutes.js";
import productRoutes from "../modules/product/productRoutes.js";
import categoryRoutes from "../modules/category/categoryRoutes.js";
import wishlistRoutes from "../modules/wishlist/wishlistRoutes.js";
import cartRoutes from "../modules/cart/cartRoutes.js";
import addressRoutes from "../modules/address/addressRoutes.js";
import orderRoutes from "../modules/order/orderRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/wishlists", wishlistRoutes);
router.use("/carts", cartRoutes);
router.use("/addresses", addressRoutes);
router.use("/orders", orderRoutes);

export default router;
