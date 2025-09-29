import { prisma } from "../../config/db.js";
import { validateCreateProduct } from "./productValidation.js";
import processAndUploadImages from "../../utils/imageUtils.js";
import slugify from "slugify";

export const addNewProduct = async (req, res, next) => {
	try {
		const validation = validateCreateProduct(req.body);
		if (!validation.success) {
			return res.status(400).json({ message: "Invalid input", errors: validation.errors });
		}
		const { categoryId, productCollection, productName, productDescription, price, offerPrice } = validation.data;

		const files = req.files || [];
		if (!files || files.length === 0) {
			return res.status(400).json({ message: "At least 1 product image is required" });
		}
		if (files.length > 3) {
			return res.status(400).json({ message: "You can upload a maximum of 3 images" });
		}

		const category = await prisma.category.findUnique({ where: { id: categoryId } });
		if (!category) {
			return res.status(404).json({ message: "Category not found" });
		}

		const imageUrls = await processAndUploadImages(files);

		const slug = slugify(productName);

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

export const getProductList = async (req, res, next) => {
	try {
		const { page = "1", limit = "9", categoryId, collectionName } = req.query;

		const pageNum = Math.max(parseInt(page, 10) || 1, 1);
		const limitNum = Math.min(Math.max(parseInt(limit, 10) || 9, 1), 100);

		const where = {};
		if (categoryId) {
			where.categoryId = categoryId;
		}
		if (collectionName) {
			where.productCollection = collectionName;
		}

		const [total, products] = await Promise.all([
			prisma.product.count({ where }),
			prisma.product.findMany({
				where,
				skip: (pageNum - 1) * limitNum,
				take: limitNum,
				orderBy: { createdAt: "desc" },
				include: { category: true },
			}),
		]);

		const productsWithCategoryName = products.map(p => ({ ...p, categoryName: p.category.name }));

		return res.status(200).json({
			page: pageNum,
			limit: limitNum,
			total,
			totalPages: Math.max(Math.ceil(total / limitNum), 1),
			products: productsWithCategoryName,
		});
	} catch (err) {
		return next(err);
	}
};

export const getProductById = async (req, res, next) => {
	try {
		const { productId } = req.params;
		if (!productId) return res.status(400).json({ message: "Product ID is required" });

		const product = await prisma.product.findUnique({ 
			where: { id: productId },
			include: { category: true },
		});
		if (!product) return res.status(404).json({ message: "Product not found" });

		const productWithCategoryName = { ...product, categoryName: product.category.name };

		return res.status(200).json({ product: productWithCategoryName });
	} catch (err) {
		return next(err);
	}
};

export const patchProduct = async (req, res, next) => {
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

		const data = {};

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
			data.productSlug = slugify(productName);
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
		if (files.length > 0) {
			if (files.length > 3) {
				return res.status(400).json({ message: "You can upload a maximum of 3 images" });
			}
			const imageUrls = await processAndUploadImages(files);
			data.images = imageUrls;
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

export const deleteProduct = async (req, res, next) => {
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

export const getBestSellerProducts = async (req, res, next) => {
	try {
		const products = await prisma.product.findMany({
			take: 50,
			orderBy: { createdAt: "desc" },
			include: { category: true },
		});
		const shuffled = products.sort(() => Math.random() - 0.5).slice(0, 12);
		const productsWithCategoryName = shuffled.map(p => ({ ...p, categoryName: p.category.name }));
		return res.status(200).json({ products: productsWithCategoryName });
	} catch (err) {
		return next(err);
	}
};

export const getLatestCollectionProducts = async (req, res, next) => {
	try {
		const products = await prisma.product.findMany({
			take: 12,
			orderBy: { createdAt: "desc" },
			include: { category: true },
		});
		const productsWithCategoryName = products.map(p => ({ ...p, categoryName: p.category.name }));
		return res.status(200).json({ products: productsWithCategoryName });
	} catch (err) {
		return next(err);
	}
};

const productController = {
	addNewProduct,
	getProductList,
	getProductById,
	patchProduct,
	deleteProduct,
	getBestSellerProducts,
	getLatestCollectionProducts,
};

export default productController;

