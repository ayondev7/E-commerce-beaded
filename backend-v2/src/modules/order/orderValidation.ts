import { z } from "zod";

export const createOrderSchema = z.object({
	addressId: z.string().uuid("Invalid address ID format"),
	notes: z.string().trim().default(""),
});

export const updateOrderStatusSchema = z.object({
	orderStatus: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]),
});

export function validateCreateOrder(data: any) {
	const result = createOrderSchema.safeParse(data);
	if (!result.success) {
		const errors = result.error.issues.map((e: any) => e.message).join("; ");
		return { success: false as const, errors };
	}
	return { success: true as const, data: result.data };
}

export function validateUpdateOrderStatus(data: any) {
	const result = updateOrderStatusSchema.safeParse(data);
	if (!result.success) {
		const errors = result.error.issues.map((e: any) => e.message).join("; ");
		return { success: false as const, errors };
	}
	return { success: true as const, data: result.data };
}
