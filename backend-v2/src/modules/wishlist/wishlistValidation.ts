import { z } from "zod";

export const addToWishlistSchema = z.object({
	productId: z.string().uuid("Invalid product ID format"),
});

export function validateAddToWishlist(data: any) {
	const result = addToWishlistSchema.safeParse(data);
	if (!result.success) {
		const errors = result.error.issues.map((e: any) => e.message).join("; ");
		return { success: false as const, errors };
	}
	return { success: true as const, data: result.data };
}
