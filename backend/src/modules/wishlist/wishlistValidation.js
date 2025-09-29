import { z } from "zod";

export const addToWishlistSchema = z.object({
	productId: z.string({ required_error: "Product ID is required" }).uuid("Invalid product ID format"),
});

export function validateAddToWishlist(data) {
	const result = addToWishlistSchema.safeParse(data);
	if (!result.success) {
		const errors = result.error.issues.map((e) => e.message).join("; ");
		return { success: false, errors };
	}
	return { success: true, data: result.data };
}