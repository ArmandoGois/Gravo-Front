import type { User, AuthResponse } from "@/domain/entities/user.entity";
import { httpService } from "@/infrastructure/services/http.service";
import { useAuthStore } from "@/infrastructure/stores/auth.store";

export const getCurrentUserUseCase = async (): Promise<User | null> => {
  try {
    const authStore = useAuthStore.getState();
    const token = authStore.getAccessToken();

    if (!token) {
      authStore.logout();
      return null;
    }

    // Set token in HTTP service if it exists
    httpService.setAuthToken(token);

    // Check if token is expired
    if (authStore.isTokenExpired()) {
      const refreshToken = authStore.getRefreshToken();
      if (!refreshToken) {
        authStore.logout();
        return null;
      }

      // Try to refresh token
      try {
        const response = await httpService.post<AuthResponse>(
          "/v1/auth/refresh",
          { refresh_token: refreshToken }
        );

        authStore.setTokens({
          access_token: response.access_token,
          refresh_token: response.refresh_token,
          expires_in: response.expires_in,
        });

        httpService.setAuthToken(response.access_token);
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        authStore.logout();
        return null;
      }
    }

    // Return user from store if available
    const user = authStore.user;
    if (user) {
      return user;
    }

    // If no user in store, auth is invalid
    authStore.logout();
    return null;
  } catch (error) {
    console.error("Error fetching current user:", error);
    useAuthStore.getState().logout();
    return null;
  }
};
