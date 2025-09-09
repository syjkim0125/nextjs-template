'use server';

import { apiJson } from './api';

type GetUserResult = {
    id: string;
    name: string;
    email: string;
};

export const getUserByTokenAction = async (
    accessToken: string
): Promise<GetUserResult | null> => {
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
        console.log('getUserByToken userData:', userData);

        return userData;
    } catch (error) {
        console.error('Error fetching user info:', error);
        return null;
    }
};
