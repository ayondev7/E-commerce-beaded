import { Router } from "express";
import upload from "../../config/multer.js";
import autMiddleware from "../../middleware/authMiddleware.js";
import categoryController from "./categoryController.js";

const router = Router();

router.get("/get-all-categories", categoryController.getAllCategories);
router.get("/get-category/:categoryId", categoryController.getCategoryById);
router.patch("/patch-category/:categoryId", autMiddleware, upload.single("image"), categoryController.patchCategory);
router.delete("/delete-category/:categoryId", autMiddleware, categoryController.deleteCategory);

export default router;
