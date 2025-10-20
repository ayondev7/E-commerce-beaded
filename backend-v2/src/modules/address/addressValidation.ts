import { z } from "zod";

export const createAddressSchema = z.object({
	addressType: z.string({ required_error: "Address type is required" }).trim().min(1, "Address type is required"),
	addressName: z.string({ required_error: "Address name is required" }).trim().min(1, "Address name is required"),
	division: z.string({ required_error: "Division is required" }).trim().min(1, "Division is required"),
	district: z.string({ required_error: "District is required" }).trim().min(1, "District is required"),
	area: z.string({ required_error: "Area is required" }).trim().min(1, "Area is required"),
	zipCode: z.string({ required_error: "Zip code is required" }).trim().min(1, "Zip code is required"),
	fullAddress: z.string({ required_error: "Full address is required" }).trim().min(1, "Full address is required"),
	isDefault: z.boolean().default(false),
});

export const updateAddressSchema = z.object({
	addressType: z.string().trim().min(1, "Address type is required").optional(),
	addressName: z.string().trim().min(1, "Address name is required").optional(),
	division: z.string().trim().min(1, "Division is required").optional(),
	district: z.string().trim().min(1, "District is required").optional(),
	area: z.string().trim().min(1, "Area is required").optional(),
	zipCode: z.string().trim().min(1, "Zip code is required").optional(),
	fullAddress: z.string().trim().min(1, "Full address is required").optional(),
	isDefault: z.boolean().optional(),
});

export function validateCreateAddress(data: any) {
	const result = createAddressSchema.safeParse(data);
	if (!result.success) {
		const errors = result.error.issues.map((e: any) => e.message).join("; ");
		return { success: false as const, errors };
	}
	return { success: true as const, data: result.data };
}

export function validateUpdateAddress(data: any) {
	const result = updateAddressSchema.safeParse(data);
	if (!result.success) {
		const errors = result.error.issues.map((e: any) => e.message).join("; ");
		return { success: false as const, errors };
	}
	return { success: true as const, data: result.data };
}
