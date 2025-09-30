import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDisplayName(name: string | undefined | null, maxWords = 2) {
  if (!name || typeof name !== "string") return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length <= maxWords) return name.trim();
  return parts.slice(0, maxWords).join(" ");
}
