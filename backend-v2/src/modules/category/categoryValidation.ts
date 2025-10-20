import { z } from "zod";

export const patchCategorySchema = z.object({
	name: z.string().trim().min(1, { message: "Category name is required" }).optional(),
});

export const createCategorySchema = z.object({
	name: z.string({ required_error: "Category name is required" }).trim().min(1, { message: "Category name is required" }),
});

export function validatePatchCategory(data: any) {
	const result = patchCategorySchema.safeParse(data);
	if (!result.success) {
		const errors = result.error.issues.map((e: any) => e.message).join("; ");
		return { success: false as const, errors };
	}
	return { success: true as const, data: result.data };
}

export function validateCreateCategory(data: any) {
	const result = createCategorySchema.safeParse(data);
	if (!result.success) {
		const errors = result.error.issues.map((e: any) => e.message).join("; ");
		return { success: false as const, errors };
	}
	return { success: true as const, data: result.data };
}
