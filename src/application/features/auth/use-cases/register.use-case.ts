import type { UserCredentials, AuthResponse } from "@/domain/entities/user.entity";
import { httpService } from "@/infrastructure/services/http.service";
import { useAuthStore } from "@/infrastructure/stores/auth.store";

export const registerUseCase = async (
    credentials: UserCredentials
): Promise<AuthResponse> => {
    try {
        // Call backend register endpoint directly
        const response = await httpService.post<AuthResponse>(
            "/v1/auth/register",
            credentials
        );

        // Store tokens, to stay logged in after registration
        useAuthStore.getState().setTokens({
            access_token: response.access_token,
            refresh_token: response.refresh_token,
            expires_in: response.expires_in,
        });

        useAuthStore.getState().setUser(response.user);
        httpService.setAuthToken(response.access_token);

        return response;
    } catch (error) {
        console.error("Error in registerUseCase while registering user:", error);
        throw error;
    }
};