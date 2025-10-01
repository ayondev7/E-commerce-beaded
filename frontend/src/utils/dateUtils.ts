export function formatToDDMMYYYY(isoDate?: string | null): string {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "-";

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}
