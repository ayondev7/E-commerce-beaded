import { z } from "zod";

export const addToCartSchema = z.object({
	productId: z.string({ required_error: "Product ID is required" }).uuid("Invalid product ID format"),
	quantity: z.number({ required_error: "Quantity is required" }).int().min(1, "Quantity must be at least 1").default(1),
	subTotal: z.number({ required_error: "Subtotal is required" }).min(0, "Subtotal must be non-negative"),
	deliveryFee: z.number({ required_error: "Delivery fee is required" }).min(0, "Delivery fee must be non-negative"),
	discount: z.number().min(0, "Discount must be non-negative").default(0),
	grandTotal: z.number({ required_error: "Grand total is required" }).min(0, "Grand total must be non-negative"),
});

export const updateCartItemSchema = z.object({
	quantity: z.number().int().min(1, "Quantity must be at least 1").optional(),
	subTotal: z.number().min(0, "Subtotal must be non-negative").optional(),
	deliveryFee: z.number().min(0, "Delivery fee must be non-negative").optional(),
	discount: z.number().min(0, "Discount must be non-negative").optional(),
	grandTotal: z.number().min(0, "Grand total must be non-negative").optional(),
});

export function validateAddToCart(data) {
	const result = addToCartSchema.safeParse(data);
	if (!result.success) {
		const errors = result.error.issues.map((e) => e.message).join("; ");
		return { success: false, errors };
	}
	return { success: true, data: result.data };
}

export function validateUpdateCartItem(data) {
	const result = updateCartItemSchema.safeParse(data);
	if (!result.success) {
		const errors = result.error.issues.map((e) => e.message).join("; ");
		return { success: false, errors };
	}
	return { success: true, data: result.data };
}