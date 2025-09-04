'use server';

// OAuth2 Server Actions for Google authentication
// Handles Google OAuth flow with JWT token management

import { redirect } from 'next/navigation';
import { getUserInfoFromBackend } from './user';
// NOTE: Server Actions must return serializable data only

export interface OAuth2Response {
    success: boolean;
    accessToken?: string;
    user?: { id: string; name: string; email: string };
    error?: string;
}

// Google OAuth2 login initiation
export async function initiateGoogleLogin(): Promise<void> {
    const backendUrl = process.env.BACKEND_AUTH_URL || 'http://localhost:8080';
    const redirectUrl = `${backendUrl}/auth/google`;

    // Redirect to backend Google OAuth endpoint
    redirect(redirectUrl as any);
}

// Handle OAuth2 callback from backend
export async function handleOAuthCallback(
    accessToken: string
): Promise<OAuth2Response> {
    // For now, just return success if token exists
    // Token validation will happen when actually using it
    return { success: !!accessToken };
}

// Logout - clear all auth data
export async function logoutOAuth(): Promise<void> {
    // Since we're not storing user data in cookies anymore,
    // we just need to redirect to login page
    // The client-side auth context will handle clearing user state
    redirect('/login');
}
