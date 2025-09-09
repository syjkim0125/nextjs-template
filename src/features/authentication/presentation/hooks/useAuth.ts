'use client';

import { useState, useTransition, useEffect } from 'react';
import { AuthenticationContainer } from '../../infrastructure/di/AuthenticationContainter';
import { User } from '../../domain/user';

export interface UseAuthReturn {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    loginWithGoogle: () => Promise<void>;
    setUserFromAccessToken: (token: string) => Promise<boolean>;
    clearError: () => void;
}

export function useAuth(): UseAuthReturn {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        setUser(null);
    }, []);

    const loginWithGoogle = async (): Promise<void> => {
        try {
            setError(null);
            const authContainer = AuthenticationContainer.getInstance();
            await authContainer.authService.initiateGoogleLogin();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Google login failed'
            );
        }
    };

    const setUserFromAccessToken = async (token: string): Promise<boolean> => {
        try {
            setError(null);
            const authContainer = AuthenticationContainer.getInstance();
            const user = await authContainer.userService.getUserProfile(token);
            if (user) {
                setUser(user);
                return true;
            }
            return false;
        } catch (err) {
            setUser(null);
            return false;
        }
    };

    return {
        user,
        isLoading: isPending,
        error,
        isAuthenticated: !!user,
        loginWithGoogle,
        setUserFromAccessToken,
        clearError: () => setError(null),
    };
}
