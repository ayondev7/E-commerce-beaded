import { Router } from "express";
import productController from "./productController.js";
import upload from "../../config/multer.js";
import autMiddleware from "../../middleware/authMiddleware.js";
import optionalAuthMiddleware from "../../middleware/optionalAuthMiddleware.js";

const router = Router();

router.get("/get-list", optionalAuthMiddleware, productController.getProductList);

router.get("/get-product/:productSlug", optionalAuthMiddleware, productController.getProductBySlug);

router.get("/get-best-seller-products", optionalAuthMiddleware, productController.getBestSellerProducts);

router.get("/get-latest-collection-products", optionalAuthMiddleware, productController.getLatestCollectionProducts);

router.get("/get-exclusive-collection-products", optionalAuthMiddleware, productController.getExclusiveCollectionProducts);

router.post(
  "/add-new-product",upload.array("images", 3),productController.addNewProduct);

router.patch("/patch-product/:productId",upload.array("images", 3),productController.patchProduct);

router.delete("/delete-product/:productId",autMiddleware,productController.deleteProduct);

export default router;
