"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  loginUseCase,
  logoutUseCase,
} from "@/application/features/auth/use-cases";
import type { UserCredentials } from "@/domain/entities/user.entity";
import { useAuthStore } from "@/infrastructure/stores/auth.store";

export const useAuth = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (credentials: UserCredentials) => loginUseCase(credentials),
    onSuccess: () => {
      router.push("/dashboard");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUseCase,
    onSuccess: () => {
      router.push("/login");
    },
  });

  return {
    user,
    isAuthenticated,
    isLoading,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    loginError: loginMutation.error,
  };
};
