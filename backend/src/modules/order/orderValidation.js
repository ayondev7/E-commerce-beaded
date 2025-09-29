import { z } from "zod";

export const createOrderSchema = z.object({
	cartId: z.string({ required_error: "Cart ID is required" }).uuid("Invalid cart ID format"),
	addressId: z.string({ required_error: "Address ID is required" }).uuid("Invalid address ID format"),
	notes: z.string().trim().default(""),
});

export const updateOrderStatusSchema = z.object({
	orderStatus: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"], {
		required_error: "Order status is required",
		invalid_type_error: "Invalid order status"
	}),
});

export function validateCreateOrder(data) {
	const result = createOrderSchema.safeParse(data);
	if (!result.success) {
		const errors = result.error.issues.map((e) => e.message).join("; ");
		return { success: false, errors };
	}
	return { success: true, data: result.data };
}

export function validateUpdateOrderStatus(data) {
	const result = updateOrderStatusSchema.safeParse(data);
	if (!result.success) {
		const errors = result.error.issues.map((e) => e.message).join("; ");
		return { success: false, errors };
	}
	return { success: true, data: result.data };
}