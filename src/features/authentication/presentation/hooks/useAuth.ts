'use client';

// Presentation Hook for client-side authentication state
// Only UI logic and user interaction

import { useState, useTransition } from 'react';
import { LoginUseCaseOutput } from '../../domain/usecases/LoginUseCase';
import { loginAction, logoutAction } from '../../infrastructure/actions/auth';

export interface UseAuthReturn {
  isLoading: boolean;
  error: string | null;
  login: (formData: FormData) => Promise<LoginUseCaseOutput>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const login = async (formData: FormData): Promise<LoginUseCaseOutput> => {
    setError(null);
    
    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          // Use Server Action instead of direct fetch
          const result = await loginAction(formData);
          
          if (!result.success && result.error) {
            setError(result.error);
          }
          
          resolve(result);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Login failed';
          setError(errorMessage);
          resolve({
            success: false,
            error: errorMessage,
          });
        }
      });
    });
  };

  const logout = async (): Promise<void> => {
    setError(null);
    
    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          // Use Server Action for logout
          await logoutAction();
          resolve();
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Logout failed';
          setError(errorMessage);
          resolve();
        }
      });
    });
  };

  const clearError = () => setError(null);

  return {
    isLoading: isPending,
    error,
    login,
    logout,
    clearError,
  };
}