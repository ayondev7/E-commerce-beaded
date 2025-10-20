import { Router } from "express";
import upload from "../../config/multer.js";
import categoryController from "./categoryController.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = Router();

router.get("/get-all-categories", categoryController.getAllCategories);
router.get("/get-category/:categoryId", categoryController.getCategoryById);
router.post("/add-new-category", authMiddleware, upload.single("image"), categoryController.addNewCategory);
router.patch("/patch-category/:categoryId", authMiddleware, upload.single("image"), categoryController.patchCategory);
router.delete("/delete-category/:categoryId", authMiddleware, categoryController.deleteCategory);

export default router;
