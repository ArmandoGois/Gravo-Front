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
    // Call login endpoint (httpOnly cookies are set automatically)
    const response = await httpService.post<AuthResponse>(
      "/auth/login",
      credentials
    );

    // Update store with user information
    useAuthStore.getState().setUser(response.user);

    return response;
  } catch (error) {
    // Clear state on error
    useAuthStore.getState().logout();
    throw error;
  }
};
