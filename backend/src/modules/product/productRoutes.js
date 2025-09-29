import { Router } from "express";
import productController from "./productController.js";
import upload from "../../config/multer.js";
import autMiddleware from "../../middleware/authMiddleware.js";

const router = Router();

router.get("/get-list", productController.getProductList);

router.get("/get-product/:productId", productController.getProductById);

router.get("/get-best-seller-products", productController.getBestSellerProducts);

router.get("/get-latest-collection-products", productController.getLatestCollectionProducts);

router.post(
  "/add-new-product",upload.array("images", 3),productController.addNewProduct);

router.patch("/patch-product/:productId",upload.array("images", 3),productController.patchProduct);

router.delete("/delete-product/:productId",autMiddleware,productController.deleteProduct);

export default router;
