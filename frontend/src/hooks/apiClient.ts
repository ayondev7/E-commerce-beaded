"use client";

import axios from "axios";
import { getSession } from "next-auth/react";
import API_URL from "@/routes";

// Create a reusable Axios instance with baseURL and JSON defaults
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  }
});

apiClient.interceptors.request.use(async (config) => {
  try {
    const session = await getSession();
    const token = session?.accessToken;
    if (token) {
      config.headers = config.headers || {};
      (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
  } catch (_) {
    
  }
  return config;
});

export default apiClient;
