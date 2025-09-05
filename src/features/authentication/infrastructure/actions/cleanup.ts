'use server';

import { cookies } from 'next/headers';

// Deletes the temporary access token cookie on the server
export async function deleteTempAccessToken(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete('tempAccessToken');
}

// Atomically read and delete the tempAccessToken cookie
export async function popTempAccessToken(): Promise<string | null> {
    const cookieStore = await cookies();
    const value = cookieStore.get('tempAccessToken')?.value ?? null;
    if (value) {
        cookieStore.delete('tempAccessToken');
    }
    return value;
}
