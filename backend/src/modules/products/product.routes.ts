import { Router } from "express";
import { asyncHandler } from "@/utils/httpError";
import { upload, processUploads } from "@/middleware/upload";
import { authMiddleware } from "@/middleware/auth";
import { createProduct, deleteProduct, getProduct, listProducts, updateProduct } from "./product.controller";

const router = Router();

router.get("/", asyncHandler(listProducts));
router.get("/:id", asyncHandler(getProduct));
router.post("/", authMiddleware, upload.array("images", 3), processUploads, asyncHandler(createProduct));
router.patch("/:id", authMiddleware, upload.array("images", 3), processUploads, asyncHandler(updateProduct));
router.delete("/:id", authMiddleware, asyncHandler(deleteProduct));

export default router;
