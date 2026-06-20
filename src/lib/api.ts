import axios, { AxiosRequestConfig } from "axios";
import { z } from "zod";
import { addToQueue, processQueue } from "./offlineQueue";
import { useAuthStore } from "./store";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const user = useAuthStore.getState().user;
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle unauthorized errors and offline queuing
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        useAuthStore.getState().logout();
        window.location.href = "/login";
      }
    }

    // Handle Network Errors (Offline)
    if (!error.response && typeof window !== "undefined" && !navigator.onLine) {
      const { config } = error;
      if (config && ["post", "put", "delete"].includes(config.method?.toLowerCase() || "")) {
        console.warn("Offline detected. Queuing mutation request...");
        addToQueue(config.url || "", config.method || "post", config.data ? JSON.parse(config.data) : null);
      }
    }

    return Promise.reject(error);
  }
);

// Auto-process queue when coming back online
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    processQueue(api);
  });
}

/**
 * Validated API helper to ensure response data matches the expected schema.
 */
export async function validatedGet<T>(
  url: string,
  schema: z.ZodSchema<T>,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await api.get(url, config);
  return schema.parse(response.data);
}

export async function validatedPost<T>(
  url: string,
  data: any,
  schema: z.ZodSchema<T>,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await api.post(url, data, config);
  return schema.parse(response.data);
}

export default api;
