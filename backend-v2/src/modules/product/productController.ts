import { prisma } from "../../config/db.js";
import { validateCreateProduct } from "./productValidation.js";
import processAndUploadImages from "../../utils/imageUtils.js";
import { generateUniqueSlug } from "../../utils/slugUtils.js";
import {
  getProductIncludeOptions,
  enrichProductsWithStatus,
  enrichSingleProductWithStatus,
  buildProductWhereCondition,
  calculatePaginationData
} from "./productServices.js";
import type { Request, Response, NextFunction } from "express";

export const addNewProduct = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const validation = validateCreateProduct(req.body);
		if (!validation.success) {
			return res.status(400).json({ message: "Invalid input", errors: validation.errors });
		}
		const { categoryId, productCollection, productName, productDescription, price, offerPrice } = validation.data;

		const files = req.files || [];
		if (!files || !Array.isArray(files) || files.length === 0) {
			return res.status(400).json({ message: "At least 1 product image is required" });
		}
		if (files.length > 3) {
			return res.status(400).json({ message: "You can upload a maximum of 3 images" });
		}

		const category = await prisma.category.findUnique({ where: { id: categoryId } });
		if (!category) {
			return res.status(404).json({ message: "Category not found" });
		}

		const imageResult = await processAndUploadImages(files);
		const imageUrls = Array.isArray(imageResult) ? imageResult : [imageResult];

		const slug = await generateUniqueSlug(productName);

		const product = await prisma.product.create({
			data: {
				categoryId,
				productCollection: productCollection || "all",
				productName,
				productDescription,
				productSlug: slug,
				price: price,
				offerPrice: offerPrice ?? null,
				images: imageUrls,
			},
		});

		return res.status(201).json({ message: "Product created successfully", product });
	} catch (err) {
		return next(err);
	}
};

export const getProductList = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { page = "1", limit = "9", categoryId, collectionName } = req.query;
		const customerId = req.customer?.id;

		const pagination = calculatePaginationData(page as string, limit as string, 0);
		const where = buildProductWhereCondition(categoryId as string | undefined, collectionName as string | undefined);

		const [total, products, totalProductsInDb] = await Promise.all([
			prisma.product.count({ where }),
			prisma.product.findMany({
				where,
				skip: pagination.skip,
				take: pagination.limitNum,
				orderBy: { createdAt: "desc" },
				include: getProductIncludeOptions(),
			}),
			prisma.product.count()
		]);

		const finalPagination = calculatePaginationData(page as string, limit as string, total);
		const productsWithStatus = await enrichProductsWithStatus(products as any, customerId);

		return res.status(200).json({
			page: finalPagination.pageNum,
			limit: finalPagination.limitNum,
			total,
			totalPages: finalPagination.totalPages,
			totalProductsInDb,
			products: productsWithStatus,
		});
	} catch (err) {
		return next(err);
	}
};

export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { productSlug } = req.params;
		const customerId = req.customer?.id;
		
		if (!productSlug) return res.status(400).json({ message: "Product slug is required" });

		const product = await prisma.product.findFirst({ 
			where: { productSlug: productSlug },
			include: getProductIncludeOptions(),
		});
		if (!product) return res.status(404).json({ message: "Product not found" });

		const productWithStatus = await enrichSingleProductWithStatus(product as any, customerId);

		return res.status(200).json({ product: productWithStatus });
	} catch (err) {
		return next(err);
	}
};

export const patchProduct = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { productId } = req.params;
		if (!productId) return res.status(400).json({ message: "Product ID is required" });

		const existing = await prisma.product.findUnique({ where: { id: productId } });
		if (!existing) return res.status(404).json({ message: "Product not found" });

		const {
			categoryId,
			productCollection,
			productName,
			productDescription,
			price,
			offerPrice,
		} = req.body || {};

		const data: any = {};

		if (categoryId && categoryId !== existing.categoryId) {
			const category = await prisma.category.findUnique({ where: { id: categoryId } });
			if (!category) return res.status(404).json({ message: "Category not found" });
			data.categoryId = categoryId;
		}

		if (typeof productCollection !== "undefined" && productCollection !== existing.productCollection) {
			data.productCollection = productCollection;
		}

		if (typeof productName !== "undefined" && productName !== existing.productName) {
			data.productName = productName;
			data.productSlug = await generateUniqueSlug(productName);
		}

		if (typeof productDescription !== "undefined" && productDescription !== existing.productDescription) {
			data.productDescription = productDescription;
		}

		if (typeof price !== "undefined") {
			data.price = price;
		}

		if (typeof offerPrice !== "undefined") {
			data.offerPrice = offerPrice === null || offerPrice === "" ? null : offerPrice;
		}

		const files = req.files || [];
		if (Array.isArray(files) && files.length > 0) {
			if (files.length > 3) {
				return res.status(400).json({ message: "You can upload a maximum of 3 images" });
			}
			const imageResult = await processAndUploadImages(files);
			data.images = Array.isArray(imageResult) ? imageResult : [imageResult];
		}

		if (Object.keys(data).length === 0) {
			return res.status(400).json({ message: "No fields provided to update" });
		}

		const updated = await prisma.product.update({ where: { id: productId }, data });
		return res.status(200).json({ message: "Product updated successfully", product: updated });
	} catch (err) {
		return next(err);
	}
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { productId } = req.params;
		if (!productId) return res.status(400).json({ message: "Product ID is required" });

		const existing = await prisma.product.findUnique({ where: { id: productId } });
		if (!existing) return res.status(404).json({ message: "Product not found" });

		const deleted = await prisma.product.delete({ where: { id: productId } });
		return res.status(200).json({ message: "Product deleted successfully", product: deleted });
	} catch (err) {
		return next(err);
	}
};

export const getBestSellerProducts = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const customerId = req.customer?.id;

		const products = await prisma.product.findMany({
			take: 50,
			orderBy: { createdAt: "desc" },
			include: getProductIncludeOptions(),
		});
		const shuffled = products.sort(() => Math.random() - 0.5).slice(0, 12);

		const productsWithStatus = await enrichProductsWithStatus(shuffled as any, customerId);

		return res.status(200).json({ products: productsWithStatus });
	} catch (err) {
		return next(err);
	}
};

export const getLatestCollectionProducts = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const customerId = req.customer?.id;

		const products = await prisma.product.findMany({
			take: 12,
			orderBy: { createdAt: "desc" },
			include: getProductIncludeOptions(),
		});

		const productsWithStatus = await enrichProductsWithStatus(products as any, customerId);

		return res.status(200).json({ products: productsWithStatus });
	} catch (err) {
		return next(err);
	}
};

export const getExclusiveCollectionProducts = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const customerId = req.customer?.id;

		const products = await prisma.product.findMany({
			take: 12,
			orderBy: { createdAt: "desc" },
			include: getProductIncludeOptions(),
		});

		const productsWithStatus = await enrichProductsWithStatus(products as any, customerId);

		return res.status(200).json({ products: productsWithStatus });
	} catch (err) {
		return next(err);
	}
};

const productController = {
	addNewProduct,
	getProductList,
	getProductBySlug,
	patchProduct,
	deleteProduct,
	getBestSellerProducts,
	getLatestCollectionProducts,
	getExclusiveCollectionProducts,
};

export default productController;
