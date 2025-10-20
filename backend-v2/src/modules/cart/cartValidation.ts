import { z } from "zod";

export const addToCartSchema = z.object({
	productId: z.string().uuid("Invalid product ID format"),
	quantity: z.number().int().min(1, "Quantity must be at least 1").default(1),
});

export const updateCartItemSchema = z.object({
	quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export function validateAddToCart(data: any) {
	const result = addToCartSchema.safeParse(data);
	if (!result.success) {
		const errors = result.error.issues.map((e: any) => e.message).join("; ");
		return { success: false as const, errors };
	}
	return { success: true as const, data: result.data };
}

export function validateUpdateCartItem(data: any) {
	const result = updateCartItemSchema.safeParse(data);
	if (!result.success) {
		const errors = result.error.issues.map((e: any) => e.message).join("; ");
		return { success: false as const, errors };
	}
	return { success: true as const, data: result.data };
}
