"use client";

import axios from "axios";
import { getSession } from "next-auth/react";
import API_URL from "@/routes";
import { AUTH_ROUTES } from "@/routes/authRoutes";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  }
});

let isRefreshing = false;
type FailedQueueItem = {
  resolve: (value?: string | null) => void;
  reject: (error?: unknown) => void;
};

let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.request.use(async (config) => {
  try {
    const session = await getSession();
    const token = session?.accessToken;

    if (token) {
      config.headers = config.headers || {};
      (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
  } catch (_) {
    // ignore session retrieval errors in request interceptor
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const session = await getSession();
        
        if (!session?.accessToken || !session?.refreshToken) {
          processQueue(error, null);
          isRefreshing = false;
          window.location.href = '/sign-in';
          return Promise.reject(error);
        }

        const response = await fetch(AUTH_ROUTES.verify, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.accessToken}`,
            "x-refresh-token": session.refreshToken,
          },
        });

        const data = await response.json();

        if (data.action === "UPDATE_ACCESS_TOKEN" && data.accessToken) {
          const { signIn } = await import("next-auth/react");
          
          await signIn("credentials", {
            mode: "tokenLogin",
            accessToken: data.accessToken,
            refreshToken: session.refreshToken,
            user: JSON.stringify(data.customer),
            redirect: false,
          });

          processQueue(null, data.accessToken);
          isRefreshing = false;

          originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
          return apiClient(originalRequest);
        } else {
          processQueue(error, null);
          isRefreshing = false;
          window.location.href = '/sign-in';
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        window.location.href = '/sign-in';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
