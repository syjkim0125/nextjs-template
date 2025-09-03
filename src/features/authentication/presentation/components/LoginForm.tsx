'use client';

// OAuth Login Form - Google OAuth2 Only
// Simplified login form with Google authentication

import { GoogleLoginButton } from './GoogleLoginButton';

export function LoginForm() {
    return (
        <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-6">
                <h2 className="text-lg font-medium text-gray-700 mb-2">
                    Sign in to your account
                </h2>
                <p className="text-sm text-gray-500">
                    Use your Google account to continue
                </p>
            </div>

            {/* Google Login Button */}
            <GoogleLoginButton />
        </div>
    );
}
