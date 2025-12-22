import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { User } from "@/domain/entities/user.entity";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiry: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setTokens: (tokens: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  isTokenExpired: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      tokenExpiry: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        }),

      setTokens: (tokens) => {
        const expiryTime = Date.now() + tokens.expires_in * 1000;
        set({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          tokenExpiry: expiryTime,
        });
      },

      setLoading: (isLoading) => set({ isLoading }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          tokenExpiry: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      getAccessToken: () => get().accessToken,

      getRefreshToken: () => get().refreshToken,

      isTokenExpired: () => {
        const expiry = get().tokenExpiry;
        if (!expiry) return true;
        // Consider expired if less than 5 minutes remaining
        return Date.now() > expiry - 5 * 60 * 1000;
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        tokenExpiry: state.tokenExpiry,
      }),
    }
  )
);
