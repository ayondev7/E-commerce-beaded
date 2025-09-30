export const SORT_OPTIONS = [
  "Price High to Low",
  "Price Low to High", 
  "By Name A to Z",
  "By Name Z to A",
  "Most Recent"
] as const;

export type SortOption = typeof SORT_OPTIONS[number];