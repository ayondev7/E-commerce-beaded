import { prisma } from "../../config/db.js";
import { validateAddToWishlist } from "./wishlistValidation.js";

const getUserWishlist = async (req, res, next) => {
	try {
		const customerId = req.customer.id;
		
		const wishlistItems = await prisma.wishlist.findMany({
			where: { customerId },
			include: {
				product: {
					include: {
						category: true
					}
				}
			},
			orderBy: { createdAt: "desc" }
		});
		
		return res.status(200).json({ wishlistItems });
	} catch (err) {
		return next(err);
	}
};

const addToWishlist = async (req, res, next) => {
	try {
		if (!req.customer || !req.customer.id) {
			return res.status(401).json({ message: "Authentication required" });
		}
		
		const customerId = req.customer.id;
		const validation = validateAddToWishlist(req.body);
		
		if (!validation.success) {
			return res.status(400).json({ message: "Invalid input", errors: validation.errors });
		}
		
		const { productId } = validation.data;
		
		const existingWishlistItem = await prisma.wishlist.findFirst({
			where: { 
				customerId,
				productId 
			}
		});
		
		if (existingWishlistItem) {
			return res.status(400).json({ message: "Product already exists in wishlist" });
		}
		
		const product = await prisma.product.findUnique({ where: { id: productId } });
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}
		
		const wishlistItem = await prisma.wishlist.create({
			data: {
				customerId,
				productId
			},
			include: {
				product: {
					include: {
						category: true
					}
				}
			}
		});
		
		return res.status(201).json({ 
			message: "Item added to wishlist successfully", 
			wishlistItem 
		});
	} catch (err) {
		return next(err);
	}
};

const removeFromWishlist = async (req, res, next) => {
	try {
		if (!req.customer || !req.customer.id) {
			return res.status(401).json({ message: "Authentication required" });
		}
		
		const { wishlistItemId } = req.params;
		const customerId = req.customer.id;
		
		if (!wishlistItemId) {
			return res.status(400).json({ message: "Wishlist item ID is required" });
		}
		
		// Check if wishlist item exists and belongs to the customer
		const existingWishlistItem = await prisma.wishlist.findFirst({
			where: { 
				id: wishlistItemId,
				customerId 
			}
		});
		
		if (!existingWishlistItem) {
			return res.status(404).json({ message: "Wishlist item not found" });
		}
		
		const deletedWishlistItem = await prisma.wishlist.delete({
			where: { id: wishlistItemId },
			include: {
				product: {
					include: {
						category: true
					}
				}
			}
		});
		
		return res.status(200).json({ 
			message: "Item removed from wishlist successfully", 
			wishlistItem: deletedWishlistItem 
		});
	} catch (err) {
		return next(err);
	}
};

const clearWishlist = async (req, res, next) => {
	try {
		if (!req.customer || !req.customer.id) {
			return res.status(401).json({ message: "Authentication required" });
		}
		
		const customerId = req.customer.id;
		
		const deletedItems = await prisma.wishlist.deleteMany({
			where: { customerId }
		});
		
		return res.status(200).json({ 
			message: "Wishlist cleared successfully", 
			deletedCount: deletedItems.count 
		});
	} catch (err) {
		return next(err);
	}
};

const wishlistController = {
	getUserWishlist,
	addToWishlist,
	removeFromWishlist,
	clearWishlist
};

export default wishlistController;