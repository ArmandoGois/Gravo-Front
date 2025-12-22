import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

import type {
  IHttpService,
  RequestConfig,
} from "@/domain/interfaces/services/http.service.interface";
import { useAuthStore } from "@/infrastructure/stores/auth.store";

// Extend Axios config to include retry flag
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

class HttpService implements IHttpService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }
  setAuthToken(_token: string): void {
    throw new Error("Method not implemented.");
  }
  clearAuthToken(): void {
    throw new Error("Method not implemented.");
  }

  private setupInterceptors() {
    // Request interceptor - Add Authorization header
    this.axiosInstance.interceptors.request.use(
      (config: ExtendedAxiosRequestConfig) => {
        const token = useAuthStore.getState().getAccessToken();
        if (token && !config._retry) {
          // eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - Handle token refresh
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest: ExtendedAxiosRequestConfig = error.config;

        // If error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const authStore = useAuthStore.getState();
            const refreshToken = authStore.getRefreshToken();

            if (!refreshToken) {
              throw new Error("No refresh token available");
            }

            // Call backend refresh endpoint directly
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/refresh`,
              { refresh_token: refreshToken }
            );

            // Update tokens in store
            authStore.setTokens({
              access_token: response.data.access_token,
              refresh_token: response.data.refresh_token,
              expires_in: response.data.expires_in,
            });

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            // If refresh fails, clear auth and redirect to login
            useAuthStore.getState().logout();
            if (
              typeof window !== "undefined" &&
              window.location.pathname !== "/login"
            ) {
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
