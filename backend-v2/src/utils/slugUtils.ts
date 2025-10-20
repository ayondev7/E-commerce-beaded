import { prisma } from "../config/db.js";
import slugify from "slugify";

export const generateUniqueSlug = async (productName: string): Promise<string> => {
	const baseSlug = slugify(productName, { lower: true, strict: true });
	let slug = baseSlug;
	let counter = 1;
	
	while (true) {
		const existingProduct = await prisma.product.findFirst({
			where: { productSlug: slug }
		});
		
		if (!existingProduct) {
			return slug;
		}
		
		slug = `${baseSlug}-${counter}`;
		counter++;
	}
};
