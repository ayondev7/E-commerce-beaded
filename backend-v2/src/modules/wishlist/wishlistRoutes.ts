import { Router } from "express";
import autMiddleware from "../../middleware/authMiddleware.js";
import wishlistController from "./wishlistController.js";

const router = Router();

router.get("/get-user-wishlist", autMiddleware, wishlistController.getUserWishlist);
router.post("/add-to-wishlist", autMiddleware, wishlistController.addToWishlist);
router.delete("/remove-from-wishlist/:wishlistItemId", autMiddleware, wishlistController.removeFromWishlist);
router.delete("/clear-wishlist", autMiddleware, wishlistController.clearWishlist);

export default router;
