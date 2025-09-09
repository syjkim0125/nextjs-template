'use client';

// Dating App Login Page
// Modern dating app inspired design with couple illustration

import { GoogleLoginButton } from '../components/GoogleLoginButton';

export function LoginPage() {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            {/* 상하 반응형: 화면이 작을 때는 상하 스크롤 가능 */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md overflow-hidden my-4 sm:my-0">
                {/* Header */}
                <div className="text-left p-4 pb-3 sm:p-6 sm:pb-4">
                    <h1 className="text-gray-600 text-sm font-medium">
                        Sign up / Log in
                    </h1>
                </div>

                {/* Couple Illustration */}
                <div className="px-4 pb-4 sm:px-6 sm:pb-6">
                    <div className="bg-pink-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 flex items-center justify-center h-40 sm:h-48">
                        {/* Simple couple illustration placeholder */}
                        <div className="text-center">
                            <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-4">
                                {/* Female figure - 정확한 원형 유지 */}
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-pink-300 rounded-full flex items-center justify-center flex-shrink-0">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-pink-400 rounded-full flex-shrink-0"></div>
                                </div>
                                {/* Heart between */}
                                <div className="text-pink-400 text-xl sm:text-2xl flex-shrink-0">
                                    ❤️
                                </div>
                                {/* Male figure - 정확한 원형 유지 */}
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-300 rounded-full flex items-center justify-center flex-shrink-0">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-400 rounded-full flex-shrink-0"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="px-4 pb-6 sm:px-6 sm:pb-8">
                    <div className="text-center mb-4 sm:mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                            AI-powered dating
                        </h2>
                        <p className="text-gray-600 text-sm sm:text-base">
                            Find your perfect match with our intelligent
                            algorithm.
                        </p>
                    </div>

                    {/* Login Options */}
                    <div className="space-y-3 sm:space-y-4">
                        {/* Apple Login */}
                        <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 px-4 sm:py-4 sm:px-6 rounded-full font-semibold hover:from-pink-600 hover:to-pink-700 transition-colors duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base">
                            <svg
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                            </svg>
                            <span>Continue with Apple</span>
                        </button>

                        {/* Google Login - Our actual login */}
                        <GoogleLoginButton />

                        {/* Email Login */}
                        <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 sm:py-4 sm:px-6 rounded-full font-semibold hover:bg-gray-200 transition-colors duration-200 text-sm sm:text-base">
                            Continue with Email
                        </button>
                    </div>

                    {/* Terms */}
                    <div className="text-center mt-4 sm:mt-6">
                        <p className="text-xs text-gray-500 leading-relaxed">
                            By continuing, you agree to our{' '}
                            <span className="text-pink-600 hover:underline cursor-pointer">
                                Terms of Service
                            </span>{' '}
                            and{' '}
                            <span className="text-pink-600 hover:underline cursor-pointer">
                                Privacy Policy
                            </span>
                            .
                        </p>
                    </div>

                    {/* Verify Age Button */}
                    <div className="mt-6 sm:mt-8">
                        <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 px-4 sm:py-4 sm:px-6 rounded-full font-semibold hover:from-pink-600 hover:to-pink-700 transition-colors duration-200 text-sm sm:text-base">
                            Verify Age
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
