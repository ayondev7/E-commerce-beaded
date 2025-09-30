import { z } from "zod";

export const addToCartSchema = z.object({
	productId: z.string({ required_error: "Product ID is required" }).uuid("Invalid product ID format"),
	quantity: z.number({ required_error: "Quantity is required" }).int().min(1, "Quantity must be at least 1").default(1),
});

export const updateCartItemSchema = z.object({
	quantity: z.number().int().min(1, "Quantity must be at least 1"),
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