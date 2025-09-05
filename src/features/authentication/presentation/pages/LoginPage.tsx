'use client';

// Login Page - PNG File Preview Design
// Exact replica of the file preview card with ocean image and magnifying glass

import { LoginForm } from '../components/LoginForm';

export function LoginPage() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
            {/* Full Image Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-80 h-96 overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-500">
                {/* Folded corner effect */}
                <div className="absolute top-0 right-0 w-16 h-16 z-10">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white bg-opacity-80 rounded-bl-3xl backdrop-blur-sm"></div>
                    <div className="absolute top-0 right-0 w-12 h-12 bg-white bg-opacity-60 rounded-bl-3xl shadow-inner"></div>
                </div>

                {/* Full card background image */}
                <div className="absolute inset-0">
                    <img
                        src="/images/ocean.png"
                        alt="Background"
                        className="w-full h-full object-cover object-center"
                        onLoad={() => {
                            console.log('✅ Image loaded successfully');
                        }}
                        onError={(e) => {
                            console.log('❌ Image failed to load, showing fallback');
                            // Fallback to gradient if image not found
                            e.currentTarget.style.display = 'none';
                            const nextEl = e.currentTarget
                                .nextElementSibling as HTMLElement;
                            if (nextEl) {
                                nextEl.style.display = 'block';
                            }
                        }}
                    />

                    {/* Fallback gradient (hidden by default) */}
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-300 via-blue-400 to-blue-600 hidden">
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-700 via-blue-500 to-transparent"></div>
                        <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-white bg-opacity-30 rounded-full"></div>
                        <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-white bg-opacity-20 rounded-full"></div>
                        <div className="absolute bottom-1/3 left-1/3 w-5 h-5 bg-white bg-opacity-25 rounded-full"></div>
                    </div>
                </div>

                {/* Subtle overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

                {/* PNG text with better contrast */}
                <div className="absolute bottom-8 left-0 right-0 text-center z-10">
                    <h1 className="text-4xl font-bold text-white drop-shadow-lg tracking-wider">
                        SIGN IN
                    </h1>
                </div>

                {/* Login overlay that appears on hover */}
                <div className="absolute inset-0 bg-white bg-opacity-95 flex flex-col justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300 p-8 rounded-3xl">
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">
                            Sign In
                        </h2>
                        <p className="text-sm text-gray-600">
                            Access your account
                        </p>
                    </div>

                    <LoginForm />
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-blue-100 rounded-full opacity-50 blur-2xl"></div>
                <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-indigo-100 rounded-full opacity-40 blur-3xl"></div>
            </div>
        </div>
    );
}
