'use client';

import { useEffect } from 'react';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { AuthenticationContainer } from '@/features/authentication/infrastructure/di/AuthenticationContainter';

export default function AuthSuccessPage() {
    const router = useRouter();

    useEffect(() => {
        (async () => {
            try {
                const container = AuthenticationContainer.getInstance();
                const result =
                    await container.authService.processOAuthCallback();
                const path = `/debug?token=${encodeURIComponent(
                    result.data ? result.data.getValue() : ''
                )}`;
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
