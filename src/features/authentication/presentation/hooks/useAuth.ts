'use client';

// OAuth2 Authentication Hook
// Handles Google OAuth2 authentication only

import { useState, useTransition, useEffect } from 'react';
import {
    initiateGoogleLogin,
    logoutOAuth,
} from '../../infrastructure/actions/oauth';
import { User, UserFactory } from '../../domain/user';
import { getUserInfoFromBackend } from '../../infrastructure/actions/user';

export interface UseAuthReturn {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    setUserFromAccessToken: (token: string) => Promise<boolean>;
    clearError: () => void;
}

export function useAuth(): UseAuthReturn {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    // Initialize auth state - don't automatically try to refresh
    // Only refresh when user explicitly tries to access protected content
    useEffect(() => {
        // Set initial state as not authenticated
        // User will be authenticated through OAuth callback or manual refresh
        setUser(null);
    }, []);

    const loginWithGoogle = async (): Promise<void> => {
        try {
            setError(null);
            await initiateGoogleLogin();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Google login failed'
            );
        }
    };

    const logout = async (): Promise<void> => {
        setError(null);
        return new Promise((resolve) => {
            startTransition(async () => {
                try {
                    // Clear client-side state
                    setUser(null);

                    // Call logout action (redirects to login)
                    await logoutOAuth();
                    resolve();
                } catch (err) {
                    const errorMessage =
                        err instanceof Error ? err.message : 'Logout failed';
                    setError(errorMessage);
                    resolve();
                }
            });
        });
    };

    const setUserFromAccessToken = async (token: string): Promise<boolean> => {
        try {
            setError(null);
            const userDto = await getUserInfoFromBackend(token);
            if (userDto) {
                const domainUser = UserFactory.toDomain(userDto);
                setUser(domainUser);
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
        logout,
        setUserFromAccessToken,
        clearError: () => setError(null),
    };
}
