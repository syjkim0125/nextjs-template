'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Route } from 'next';

import { apiJson } from './api';
import { RefreshAccessTokenResult } from '../../domain/auth/IAuthenticationRepository';

export const redirectToGoogleLogin = async (): Promise<void> => {
    const backendUrl = process.env.BACKEND_AUTH_URL || 'http://localhost:8080';
    const redirectUrl = `${backendUrl}/auth/google`;
    redirect(redirectUrl as Route);
};

export const refreshAccessTokenAction =
    async (): Promise<RefreshAccessTokenResult> => {
        try {
            const backendUrl =
                process.env.BACKEND_AUTH_URL || 'http://localhost:8080';

            const cookieStore = await cookies();
            const cookieHeader = cookieStore
                .getAll()
                .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
                .join('; ');

            const data = await apiJson<{
                accessToken?: string;
                [k: string]: any;
            }>({
                baseUrl: backendUrl,
                endpoint: '/auth/refresh',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Cookie: cookieHeader,
                },
                autoRefreshOn401: false,
            });

            if (data?.accessToken) {
                return { success: true, accessToken: data.accessToken };
            }
            return {
                success: false,
                error: 'No access token in refresh response',
            };
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.debug('refreshAccessToken error:', error);
            }
            return { success: false, error: 'Refresh error' };
        }
    };
