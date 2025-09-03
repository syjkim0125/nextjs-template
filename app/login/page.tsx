// App Router Page - Login Route
// Imports and renders LoginPage from features

import { LoginPage } from '@/features/authentication/presentation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Your App',
  description: 'Sign in to your account to access your dashboard and manage your data.',
  robots: 'noindex, nofollow', // Don't index login pages
};

// Server Component - renders login page without auth check
export default function Page() {
  return <LoginPage />;
}