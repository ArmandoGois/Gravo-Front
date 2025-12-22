import type {
  UserCredentials,
  AuthResponse,
} from "@/domain/entities/user.entity";
import { httpService } from "@/infrastructure/services/http.service";
import { useAuthStore } from "@/infrastructure/stores/auth.store";

export const loginUseCase = async (
  credentials: UserCredentials
): Promise<AuthResponse> => {
  try {
    // Call backend login endpoint directly
    const response = await httpService.post<AuthResponse>(
      "/v1/auth/login",
      credentials
    );

    // Store tokens
    useAuthStore.getState().setTokens({
      access_token: response.access_token,
      refresh_token: response.refresh_token,
      expires_in: response.expires_in,
    });

    // Update user
    useAuthStore.getState().setUser(response.user);

    // Set token in HTTP service
    httpService.setAuthToken(response.access_token);

    return response;
  } catch (error) {
    // Clear state on error
    useAuthStore.getState().logout();
    throw error;
  }
};
