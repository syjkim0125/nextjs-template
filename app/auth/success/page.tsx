'use client';

import { useEffect } from 'react';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { AccessToken } from '@/features/authentication/domain/token';
import { popTempAccessToken } from '@/features/authentication/infrastructure/actions/cleanup';

function buildDestinationUrl(temp: string | null): string {
    if (!temp) return '/login?error=no_token';
    const token = new AccessToken(temp);
    if (!token.isValid()) return '/login?error=invalid_token';
    return `/debug?token=${encodeURIComponent(token.getValue())}`;
}

export default function AuthSuccessPage() {
    const router = useRouter();

    useEffect(() => {
        (async () => {
            try {
                const tempAccessToken = await popTempAccessToken();
                const path = buildDestinationUrl(tempAccessToken);
                router.replace(path as Route);
            } catch {
                router.replace('/login?error=cleanup_failed' as Route);
            }
        })();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center text-gray-600">
            Processing authentication...
        </div>
    );
}
