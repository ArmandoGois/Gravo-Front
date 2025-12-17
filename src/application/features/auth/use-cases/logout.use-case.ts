import { httpService } from "@/infrastructure/services/http.service";
import { useAuthStore } from "@/infrastructure/stores/auth.store";

export const logoutUseCase = async (): Promise<void> => {
  try {
    // Call logout endpoint (removes httpOnly cookies)
    await httpService.post("/auth/logout");
  } catch (error) {
    console.error("Error during logout:", error);
  } finally {
    // Always clear local state, even if the request fails
    useAuthStore.getState().logout();
  }
};
