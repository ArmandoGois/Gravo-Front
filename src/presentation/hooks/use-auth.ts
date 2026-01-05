"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  loginUseCase,
  logoutUseCase,
  registerUseCase
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

  const registerMutation = useMutation({
    mutationFn: (data: UserCredentials) => registerUseCase(data),
    onSuccess: (_data, variables) => {
      // Automatically log in after registration
      loginMutation.mutate(variables);
    },
  });

  return {
    user,
    isAuthenticated,
    isLoading,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    register: registerMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    isRegistrationLoading: registerMutation.isPending,
    loginError: loginMutation.error,
    registrationError: registerMutation.error,
  };
};
