import type { User } from "@/domain/entities/user.entity";
import { httpService } from "@/infrastructure/services/http.service";
import { useAuthStore } from "@/infrastructure/stores/auth.store";

export const getCurrentUserUseCase = async (): Promise<User | null> => {
  try {
    // Get current user from server (validates httpOnly cookie)
    const user = await httpService.get<User>("/auth/me");

    // Update store
    useAuthStore.getState().setUser(user);

    return user;
  } catch (error) {
    console.error("Error fetching current user:", error);
    // If it fails, clear the state
    useAuthStore.getState().logout();
    return null;
  }
};
