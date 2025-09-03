'use server';

// Token utilities separated to avoid circular deps
// Provides: refreshAccessToken using server cookies

import { cookies } from 'next/headers';
import { apiJson } from './api';

export async function refreshAccessToken(): Promise<{
    success: boolean;
    accessToken?: string;
    error?: string;
}> {
    try {
        const backendUrl =
            process.env.BACKEND_AUTH_URL || 'http://localhost:8080';

        // Build Cookie header from incoming request cookies
        const cookieStore = await cookies();
        const cookieHeader = cookieStore
            .getAll()
            .map((c) => `${c.name}=${encodeURIComponent(c.value)}`)
            .join('; ');

        const data = await apiJson<{ accessToken?: string; [k: string]: any }>({
            baseUrl: backendUrl,
            endpoint: '/auth/refresh',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Cookie: cookieHeader,
            },
            autoRefreshOn401: false, // refresh 호출 자체는 재귀적으로 재시도하지 않음
        });

        if (data?.accessToken) {
            return { success: true, accessToken: data.accessToken };
        }
        return { success: false, error: 'No access token in refresh response' };
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.debug('refreshAccessToken error:', error);
        }
        return { success: false, error: 'Refresh error' };
    }
}
