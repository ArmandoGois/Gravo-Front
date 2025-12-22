"use client";

import { useEffect, type ReactNode } from "react";

import { getCurrentUserUseCase } from "@/application/features/auth/use-cases";
import { httpService } from "@/infrastructure/services/http.service";
import { useAuthStore } from "@/infrastructure/stores/auth.store";

import { QueryProvider } from "./query-provider";

export const RootProvider = ({ children }: { children: ReactNode }) => {
  const { setLoading, getAccessToken } = useAuthStore();

  useEffect(() => {
    // Initialize auth on app load
    const initAuth = async () => {
      setLoading(true);

      // Set token in HTTP service if it exists in store
      const token = getAccessToken();
      if (token) {
        httpService.setAuthToken(token);
      }

      // Validate session
      await getCurrentUserUseCase();

      setLoading(false);
    };

    initAuth();
  }, [setLoading, getAccessToken]);

  return <QueryProvider>{children}</QueryProvider>;
};
