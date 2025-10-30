import { prisma } from "../../config/db.js";
import processAndUploadImages from "../../utils/imageUtils.js";
import { validatePatchCategory, validateCreateCategory } from "./categoryValidation.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ValidationError, BadRequestError, NotFoundError } from "../../utils/errors.js";
import type { Request, Response } from "express";

const addNewCategory = asyncHandler(async (req: Request, res: Response) => {
	const validation = validateCreateCategory(req.body);
	if (!validation.success) {
		throw new ValidationError("Invalid input", validation.errors);
	}
	const { name } = validation.data;

	const file = (req.files && Array.isArray(req.files) && req.files[0]) || req.file || null;
	if (!file) throw new BadRequestError("Category image is required");

	const imageResult = await processAndUploadImages(file);
	const imageUrl = typeof imageResult === 'string' ? imageResult : imageResult[0];

	const category = await prisma.category.create({
		data: { name, image: imageUrl },
	});
	return res.status(201).json({ message: "Category created successfully", category });
});

const getAllCategories = asyncHandler(async (_req: Request, res: Response) => {
	const categories = await prisma.category.findMany({ orderBy: { createdAt: "desc" } });
	return res.status(200).json({ categories });
});

const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
	const { categoryId } = req.params;
	if (!categoryId) throw new BadRequestError("Category ID is required");
	const category = await prisma.category.findUnique({ where: { id: categoryId } });
	if (!category) throw new NotFoundError("Category not found");
	return res.status(200).json({ category });
});

const patchCategory = asyncHandler(async (req: Request, res: Response) => {
	const { categoryId } = req.params;
	if (!categoryId) throw new BadRequestError("Category ID is required");

	const existing = await prisma.category.findUnique({ where: { id: categoryId } });
	if (!existing) throw new NotFoundError("Category not found");

	const validation = validatePatchCategory(req.body || {});
	if (!validation.success) {
		throw new ValidationError("Invalid input", validation.errors);
	}

	const data: any = {};
	const { name } = validation.data;
	if (typeof name !== "undefined" && name !== existing.name) {
		data.name = name;
	}

	const file = (req.files && Array.isArray(req.files) && req.files[0]) || req.file || null;
	if (file) {
		const imageResult = await processAndUploadImages(file);
		data.image = typeof imageResult === 'string' ? imageResult : imageResult[0];
	}

	if (Object.keys(data).length === 0) {
		throw new BadRequestError("No fields provided to update");
	}

	const updated = await prisma.category.update({ where: { id: categoryId }, data });
	return res.status(200).json({ message: "Category updated successfully", category: updated });
});

const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
	const { categoryId } = req.params;
	if (!categoryId) throw new BadRequestError("Category ID is required");

	const existing = await prisma.category.findUnique({ where: { id: categoryId } });
	if (!existing) throw new NotFoundError("Category not found");

	const deleted = await prisma.$transaction(async (tx) => {
		const products = await tx.product.findMany({
			where: { categoryId },
			select: { id: true }
		});
		
		const productIds = products.map(p => p.id);
		
		if (productIds.length > 0) {
			await tx.cartItem.deleteMany({
				where: { productId: { in: productIds } }
			});
			
			await tx.wishlist.deleteMany({
				where: { productId: { in: productIds } }
			});
			
			await tx.orderItem.deleteMany({
				where: { productId: { in: productIds } }
			});
			
			await tx.product.deleteMany({
				where: { categoryId }
			});
		}
		
		return await tx.category.delete({ where: { id: categoryId } });
	});
	
	return res.status(200).json({ message: "Category deleted successfully", category: deleted });
});

const categoryController = {
	addNewCategory,
	getAllCategories,
	getCategoryById,
	patchCategory,
	deleteCategory,
};

export default categoryController;
