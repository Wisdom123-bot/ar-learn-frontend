import axios, { AxiosRequestConfig } from "axios";
import { z } from "zod";

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
      const stored = localStorage.getItem("teacher");
      if (stored) {
        try {
          const user = JSON.parse(stored);
          const token = user.token; // Now using the signed JWT token
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (e) {
          console.error("Error parsing user from localStorage", e);
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("teacher");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

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
