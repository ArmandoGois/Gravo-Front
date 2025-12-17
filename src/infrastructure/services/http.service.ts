import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

import type {
  IHttpService,
  RequestConfig,
} from "@/domain/interfaces/services/http.service.interface";

class HttpService implements IHttpService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // Important for httpOnly cookies
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // You could add tokens from localStorage here if needed
        // But with httpOnly cookies, the browser sends them automatically
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Try to refresh the token
            await this.post("/auth/refresh");
            // Retry the original request
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            // If refresh fails, redirect to login
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private mapConfig(config?: RequestConfig): AxiosRequestConfig {
    return {
      headers: config?.headers,
      params: config?.params,
      timeout: config?.timeout,
    };
  }

  async get<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(
      url,
      this.mapConfig(config)
    );
    return response.data;
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.post<T>(
      url,
      data,
      this.mapConfig(config)
    );
    return response.data;
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.put<T>(
      url,
      data,
      this.mapConfig(config)
    );
    return response.data;
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.patch<T>(
      url,
      data,
      this.mapConfig(config)
    );
    return response.data;
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(
      url,
      this.mapConfig(config)
    );
    return response.data;
  }
}

// Exportar instancia singleton
export const httpService = new HttpService();
