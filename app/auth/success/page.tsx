// OAuth2 Success Page
// Processes OAuth callback and redirects to debug page

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { handleOAuthCallback } from '@/features/authentication/infrastructure/actions/oauth';

export default async function AuthSuccessPage() {
    // Get temporary access token from httpOnly cookie
    const cookieStore = await cookies();
    const tempAccessToken = cookieStore.get('tempAccessToken')?.value;

    // Verify token server-side to trigger /user/me call (server logs)
    if (tempAccessToken) {
        const result = await handleOAuthCallback(tempAccessToken);
        if (result.success) {
            // Pass token to debug page for client-side display only
            redirect(`/debug?token=${encodeURIComponent(tempAccessToken)}`);
        } else {
            redirect('/login?error=auth_failed');
        }
    }

    redirect('/login?error=no_token');
}
