import { Router } from "express";
import autMiddleware from "../../middleware/authMiddleware.js";
import cartController from "./cartController.js";

const router = Router();

router.get("/get-user-cart", autMiddleware, cartController.getUserCart);
router.post("/add-to-cart", autMiddleware, cartController.addToCart);
router.patch("/update-cart-item/:cartItemId", autMiddleware, cartController.updateCartItem);
router.delete("/remove-from-cart/:cartItemId", autMiddleware, cartController.removeFromCart);
router.delete("/clear-cart", autMiddleware, cartController.clearCart);

export default router;