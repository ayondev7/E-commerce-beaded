/**
 * Converts a URL slug to a readable name by replacing hyphens with spaces
 * @param slug - The URL slug (e.g., "hot-deals", "mens-accessories")
 * @returns The readable name (e.g., "hot deals", "mens accessories")
 */
export const slugToReadableName = (slug: string): string => {
  if (!slug || typeof slug !== 'string') return '';
  return slug.replace(/-/g, ' ').trim();
};

/**
 * Converts a readable name to a URL slug by replacing spaces with hyphens and converting to lowercase
 * @param name - The readable name (e.g., "Hot Deals", "Mens Accessories")
 * @returns The URL slug (e.g., "hot-deals", "mens-accessories")
 */
export const readableNameToSlug = (name: string): string => {
  if (!name || typeof name !== 'string') return '';
  return name.toLowerCase().replace(/\s+/g, '-').trim();
};