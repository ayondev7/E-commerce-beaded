import { Router } from "express";
import { upload, processUploads } from "../../middleware/upload.js";
import { authMiddleware } from "../../middleware/auth.js";
import { createProduct, deleteProduct, getProduct, listProducts, updateProduct } from "./product.controller.js";

const router = Router();

// Create simple asyncHandler replacement
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get("/", asyncHandler(listProducts));
router.get("/:id", asyncHandler(getProduct));
router.post("/", upload.array("images", 3), processUploads, asyncHandler(createProduct));
router.patch("/:id", authMiddleware, upload.array("images", 3), processUploads, asyncHandler(updateProduct));
router.delete("/:id", authMiddleware, asyncHandler(deleteProduct));

export default router;
