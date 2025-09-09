'use client';

// Minimalist Login Form - Google OAuth2 Only
// Clean, simple design matching file preview aesthetic

import { GoogleLoginButton } from './GoogleLoginButton';

export function LoginForm() {
    return (
        <div className="w-full">
            <GoogleLoginButton />
        </div>
    );
}
