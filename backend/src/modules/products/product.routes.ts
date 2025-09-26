import { Router } from "express";
import { asyncHandler } from "@/utils/httpError";
import { upload, processUploads } from "@/middleware/upload";
import { requireAuth, optionalAuth } from "@/middleware/auth";
import { createProduct, deleteProduct, getProduct, listProducts, updateProduct } from "./product.controller";

const router = Router();

router.get("/", optionalAuth, asyncHandler(listProducts));
router.get("/:id", optionalAuth, asyncHandler(getProduct));
router.post("/", requireAuth, upload.array("images", 8), processUploads, asyncHandler(createProduct));
router.patch("/:id", requireAuth, upload.array("images", 8), processUploads, asyncHandler(updateProduct));
router.delete("/:id", requireAuth, asyncHandler(deleteProduct));

export default router;
