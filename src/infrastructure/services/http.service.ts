import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
  AxiosError
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

  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

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

  private onRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  private addSubscriber(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback);
  }

  setAuthToken(token: string): void {
    this.axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;
  }

  clearAuthToken(): void {
    delete this.axiosInstance.defaults.headers.common["Authorization"];
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config: ExtendedAxiosRequestConfig) => {
        const token = useAuthStore.getState().getAccessToken();
        if (token && !config.headers.Authorization) {
          // eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as ExtendedAxiosRequestConfig;

        // If there is no original request or it's already a retry, reject
        if (!originalRequest || originalRequest._retry) {
          return Promise.reject(error);
        }

        if (error.response?.status === 401) {
          // CASE 1: Is already refreshing the token
          // Push the request to the subscribers queue
          if (this.isRefreshing) {
            return new Promise((resolve) => {
              this.addSubscriber((token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(this.axiosInstance(originalRequest));
              });
            });
          }

          // CASE 2: We´re first in queue - refresh the token
          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const authStore = useAuthStore.getState();
            const refreshToken = authStore.getRefreshToken();

            // If no refresh token, logout immediately
            if (!refreshToken) {
              throw new Error("No refresh token stored");
            }

            // Call refresh token endpoint
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/refresh`,
              { refresh_token: refreshToken }
            );

            const { access_token, refresh_token, expires_in } = response.data;

            // Update tokens in the store
            authStore.setTokens({
              access_token,
              refresh_token,
              expires_in,
            });

            // Notify all the subscribers with the new token
            this.onRefreshed(access_token);

            // Retry the original request with the new token
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return this.axiosInstance(originalRequest);

          } catch (refreshError) {
            // If fails to refresh token, clear tokens from store
            // And logout the user
            this.refreshSubscribers = []; // Limpiar cola
            useAuthStore.getState().logout();

            if (typeof window !== "undefined" && window.location.pathname !== "/login") {
              window.location.href = "/login";
            }

            return Promise.reject(refreshError);
          } finally {
            // Free the refresh flag
            this.isRefreshing = false;
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
