'use client';

import { useEffect, type ReactNode } from 'react';

import { getCurrentUserUseCase } from '@/application/features/auth/use-cases';
import { useAuthStore } from '@/infrastructure/stores/auth.store';

import { QueryProvider } from './query-provider';

export const RootProvider = ({ children }: { children: ReactNode }) => {
  const { setLoading } = useAuthStore();

  useEffect(() => {
    // Check if user is authenticated when loading the app
    const initAuth = async () => {
      setLoading(true);
      await getCurrentUserUseCase();
      setLoading(false);
    };

    initAuth();
  }, [setLoading]);

  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  );
};
