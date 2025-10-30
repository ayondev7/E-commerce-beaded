import { prisma } from "../../config/db.js";
import { validateAddToWishlist } from "./wishlistValidation.js";
import {
  getWishlistIncludeOptions,
  enrichWishlistWithCartStatus,
  findExistingWishlistItem,
  findWishlistItemByIdAndCustomer
} from "./wishlistServices.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ValidationError, UnauthorizedError, BadRequestError, NotFoundError } from "../../utils/errors.js";
import type { Request, Response } from "express";

const getUserWishlist = asyncHandler(async (req: Request, res: Response) => {
	const customerId = req.customer!.id;
	
	const wishlistItems = await prisma.wishlist.findMany({
		where: { customerId },
		include: getWishlistIncludeOptions(),
		orderBy: { createdAt: "desc" }
	});

	const wishlistWithCartStatus = await enrichWishlistWithCartStatus(wishlistItems, customerId);
	
	return res.status(200).json({ wishlistItems: wishlistWithCartStatus });
});

const addToWishlist = asyncHandler(async (req: Request, res: Response) => {
	if (!req.customer || !req.customer.id) {
		throw new UnauthorizedError("Authentication required");
	}
	
	const customerId = req.customer.id;
	const validation = validateAddToWishlist(req.body);
	
	if (!validation.success) {
		throw new ValidationError("Invalid input", validation.errors);
	}
	
	const { productId } = validation.data;
	
	const existingWishlistItem = await findExistingWishlistItem(customerId, productId);
	
	if (existingWishlistItem) {
		throw new BadRequestError("Product already exists in wishlist");
	}
	
	const product = await prisma.product.findUnique({ where: { id: productId } });
	if (!product) {
		throw new NotFoundError("Product not found");
	}
	
	const wishlistItem = await prisma.wishlist.create({
		data: {
			customerId,
			productId
		},
		include: getWishlistIncludeOptions()
	});
	
	return res.status(201).json({ 
		message: "Item added to wishlist successfully", 
		wishlistItem 
	});
});

const removeFromWishlist = asyncHandler(async (req: Request, res: Response) => {
	if (!req.customer || !req.customer.id) {
		throw new UnauthorizedError("Authentication required");
	}
	
	const { wishlistItemId } = req.params;
	const customerId = req.customer.id;
	
	if (!wishlistItemId) {
		throw new BadRequestError("Wishlist item ID is required");
	}
	
	const existingWishlistItem = await findWishlistItemByIdAndCustomer(wishlistItemId, customerId);
	
	if (!existingWishlistItem) {
		throw new NotFoundError("Wishlist item not found");
	}
	
	const deletedWishlistItem = await prisma.wishlist.delete({
		where: { id: wishlistItemId },
		include: getWishlistIncludeOptions()
	});
	
	return res.status(200).json({ 
		message: "Item removed from wishlist successfully", 
		wishlistItem: deletedWishlistItem 
	});
});

const clearWishlist = asyncHandler(async (req: Request, res: Response) => {
	if (!req.customer || !req.customer.id) {
		throw new UnauthorizedError("Authentication required");
	}
	
	const customerId = req.customer.id;
	
	const deletedItems = await prisma.wishlist.deleteMany({
		where: { customerId }
	});
	
	return res.status(200).json({ 
		message: "Wishlist cleared successfully", 
		deletedCount: deletedItems.count 
	});
});

const wishlistController = {
	getUserWishlist,
	addToWishlist,
	removeFromWishlist,
	clearWishlist
};

export default wishlistController;
