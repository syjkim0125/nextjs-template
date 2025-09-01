// App Router Page - Login Route
// Imports and renders LoginPage from features

import { LoginPage } from '@/features/authentication/presentation';
import { authContainer } from '@/features/authentication/application/di/AuthContainer';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Your App',
  description: 'Sign in to your account to access your dashboard and manage your data.',
  robots: 'noindex, nofollow', // Don't index login pages
};

// Server Component - checks auth before rendering
export default async function Page() {
  // Redirect if already authenticated
  try {
    await authContainer.nextAuthService.redirectIfAuthenticated();
  } catch (error) {
    // If check fails, continue to login page
    console.warn('Auth check failed:', error);
  }

  return <LoginPage />;
}