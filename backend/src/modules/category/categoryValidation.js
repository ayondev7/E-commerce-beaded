import { z } from "zod";

export const patchCategorySchema = z.object({
	name: z.string().trim().min(1, { message: "Category name is required" }).optional(),
});

export function validatePatchCategory(data) {
	const result = patchCategorySchema.safeParse(data);
	if (!result.success) {
		const errors = result.error.issues.map((e) => e.message).join("; ");
		return { success: false, errors };
	}
	return { success: true, data: result.data };
}
