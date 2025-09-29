import { Router } from "express";
import productController from "./productController.js";
import upload from "../../config/multer.js";
import autMiddleware from "../../middleware/authMiddleware.js";

const router = Router();

// GET: list all products
router.get("/get-list", productController.getProductList);

// GET: get a single product by id
router.get("/get-product/:productId", productController.getProductById);

router.post(
  "/add-new-product",upload.array("images", 3),productController.addNewProduct);

// PATCH: update product basic fields
router.patch("/patch-product/:productId",upload.array("images", 3),productController.patchProduct);

// DELETE: remove a product
router.delete("/delete-product/:productId",autMiddleware,productController.deleteProduct);

export default router;
