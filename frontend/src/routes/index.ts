// API base configuration (simple string concatenation)
const RAW_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";
export const BASE_URL = RAW_BASE.replace(/\/+$/, "");
export const API_URL = `${BASE_URL}/api`;
export default API_URL;
