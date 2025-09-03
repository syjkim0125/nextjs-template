'use server';

import { apiJson } from './api';

// Get user info from backend using access token
export async function getUserInfoFromBackend(
    accessToken: string
): Promise<{ id: string; name: string; email: string } | null> {
    try {
        const backendUrl =
            process.env.BACKEND_USER_URL || 'http://localhost:3001';

        const userData = await apiJson<{
            id: string;
            name: string;
            email: string;
        }>({
            baseUrl: backendUrl,
            endpoint: '/user/me',
            method: 'GET',
            token: accessToken,
            autoRefreshOn401: true,
        });
        console.log('getUserInfoFromBackend userData:', userData);

        // Return plain JSON (serializable) for Client Components
        return {
            id: userData.id,
            name: userData.name,
            email: userData.email,
        };
    } catch (error) {
        console.error('Error fetching user info:', error);
        return null;
    }
}
