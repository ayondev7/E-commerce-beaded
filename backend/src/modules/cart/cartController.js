import { prisma } from "../../config/db.js";
import { validateAddToCart, validateUpdateCartItem } from "./cartValidation.js";

const getUserCart = async (req, res, next) => {
	try {
		const customerId = req.customer.id;
		
		const cartItems = await prisma.cart.findMany({
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
		
		return res.status(200).json({ cartItems });
	} catch (err) {
		return next(err);
	}
};

const addToCart = async (req, res, next) => {
	try {
		if (!req.customer || !req.customer.id) {
			return res.status(401).json({ message: "Authentication required" });
		}
		
		const customerId = req.customer.id;
		const validation = validateAddToCart(req.body);
		
		if (!validation.success) {
			return res.status(400).json({ message: "Invalid input", errors: validation.errors });
		}
		
		const { productId, quantity, subTotal, deliveryFee, discount, grandTotal } = validation.data;
		
		const existingCartItem = await prisma.cart.findFirst({
			where: { 
				customerId,
				productId 
			}
		});
		
		if (existingCartItem) {
			return res.status(400).json({ message: "Product already exists in cart" });
		}
		
		const product = await prisma.product.findUnique({ where: { id: productId } });
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}
		
		const cartItem = await prisma.cart.create({
			data: {
				customerId,
				productId,
				quantity,
				subTotal,
				deliveryFee,
				discount,
				grandTotal
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
			message: "Item added to cart successfully", 
			cartItem 
		});
	} catch (err) {
		return next(err);
	}
};

const updateCartItem = async (req, res, next) => {
	try {
		const { cartItemId } = req.params;
		const customerId = req.customer.id;
		
		if (!cartItemId) {
			return res.status(400).json({ message: "Cart item ID is required" });
		}
		
		const validation = validateUpdateCartItem(req.body);
		if (!validation.success) {
			return res.status(400).json({ message: "Invalid input", errors: validation.errors });
		}
		
		// Check if cart item exists and belongs to the customer
		const existingCartItem = await prisma.cart.findFirst({
			where: { 
				id: cartItemId,
				customerId 
			}
		});
		
		if (!existingCartItem) {
			return res.status(404).json({ message: "Cart item not found" });
		}
		
		const data = {};
		const { quantity, subTotal, deliveryFee, discount, grandTotal } = validation.data;
		
		if (typeof quantity !== "undefined" && quantity !== existingCartItem.quantity) {
			data.quantity = quantity;
		}
		if (typeof subTotal !== "undefined" && subTotal !== existingCartItem.subTotal) {
			data.subTotal = subTotal;
		}
		if (typeof deliveryFee !== "undefined" && deliveryFee !== existingCartItem.deliveryFee) {
			data.deliveryFee = deliveryFee;
		}
		if (typeof discount !== "undefined" && discount !== existingCartItem.discount) {
			data.discount = discount;
		}
		if (typeof grandTotal !== "undefined" && grandTotal !== existingCartItem.grandTotal) {
			data.grandTotal = grandTotal;
		}
		
		if (Object.keys(data).length === 0) {
			return res.status(400).json({ message: "No fields provided to update" });
		}
		
		const updatedCartItem = await prisma.cart.update({
			where: { id: cartItemId },
			data,
			include: {
				product: {
					include: {
						category: true
					}
				}
			}
		});
		
		return res.status(200).json({ 
			message: "Cart item updated successfully", 
			cartItem: updatedCartItem 
		});
	} catch (err) {
		return next(err);
	}
};

const removeFromCart = async (req, res, next) => {
	try {
		if (!req.customer || !req.customer.id) {
			return res.status(401).json({ message: "Authentication required" });
		}
		
		const { cartItemId } = req.params;
		const customerId = req.customer.id;
		
		if (!cartItemId) {
			return res.status(400).json({ message: "Cart item ID is required" });
		}
		
		// Check if cart item exists and belongs to the customer
		const existingCartItem = await prisma.cart.findFirst({
			where: { 
				id: cartItemId,
				customerId 
			}
		});
		
		if (!existingCartItem) {
			return res.status(404).json({ message: "Cart item not found" });
		}
		
		const deletedCartItem = await prisma.cart.delete({
			where: { id: cartItemId },
			include: {
				product: {
					include: {
						category: true
					}
				}
			}
		});
		
		return res.status(200).json({ 
			message: "Item removed from cart successfully", 
			cartItem: deletedCartItem 
		});
	} catch (err) {
		return next(err);
	}
};

const clearCart = async (req, res, next) => {
	try {
		if (!req.customer || !req.customer.id) {
			return res.status(401).json({ message: "Authentication required" });
		}
		
		const customerId = req.customer.id;
		
		const deletedItems = await prisma.cart.deleteMany({
			where: { customerId }
		});
		
		return res.status(200).json({ 
			message: "Cart cleared successfully", 
			deletedCount: deletedItems.count 
		});
	} catch (err) {
		return next(err);
	}
};

const cartController = {
	getUserCart,
	addToCart,
	updateCartItem,
	removeFromCart,
	clearCart
};

export default cartController;