'use server';

import { cookies } from 'next/headers';

export const deleteCookie = async (name: string): Promise<void> => {
    const cookieStore = await cookies();
    cookieStore.delete(name);
};

export const popTempAccessTokenAction = async (): Promise<string | null> => {
    const cookieStore = await cookies();
    const value = cookieStore.get('tempAccessToken')?.value ?? null;
    if (value) {
        cookieStore.delete('tempAccessToken');
    }
    return value;
};
