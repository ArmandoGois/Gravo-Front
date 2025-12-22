import { httpService } from "@/infrastructure/services/http.service";
import { useAuthStore } from "@/infrastructure/stores/auth.store";

export const logoutUseCase = async (): Promise<void> => {
  try {
    // Call backend logout endpoint directly
    await httpService.post("/v1/auth/logout");
  } catch (error) {
    console.error("Error during logout:", error);
  } finally {
    // Clear tokens from HTTP service
    httpService.clearAuthToken();
    // Always clear local state, even if the request fails
    useAuthStore.getState().logout();
  }
};
