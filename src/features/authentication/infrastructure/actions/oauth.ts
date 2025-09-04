'use server';

// OAuth2 Server Actions for Google authentication
// Handles Google OAuth flow with JWT token management

import { redirect } from 'next/navigation';

// Google OAuth2 login initiation
export async function initiateGoogleLogin(): Promise<void> {
    const backendUrl = process.env.BACKEND_AUTH_URL || 'http://localhost:8080';
    const redirectUrl = `${backendUrl}/auth/google`;

    // Redirect to backend Google OAuth endpoint
    redirect(redirectUrl as any);
}

// Logout - clear all auth data
export async function logoutOAuth(): Promise<void> {
    // Since we're not storing user data in cookies anymore,
    // we just need to redirect to login page
    // The client-side auth context will handle clearing user state
    redirect('/login');
}
