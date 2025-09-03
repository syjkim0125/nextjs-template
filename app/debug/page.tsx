// Debug Page - Shows OAuth callback results
// Temporary page to verify OAuth flow is working correctly

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/authentication/presentation/hooks/useAuth';

export default function DebugPage() {
  const { user, isLoading, error, isAuthenticated, setUserFromAccessToken } = useAuth();
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [fullUrl, setFullUrl] = useState<string | null>(null);
  const [searchStr, setSearchStr] = useState<string | null>(null);

  useEffect(() => {
    // Get access token from URL params if available
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setAccessToken(token);
      // 토큰으로 직접 유저 세팅 (refreshToken 사용 안 함)
      setUserFromAccessToken(token);
    }

    // Defer browser-only values to client after mount to avoid hydration mismatch
    setFullUrl(window.location.href);
    setSearchStr(window.location.search || 'None');
  }, []);

  const goToLogin = () => {
    router.push('/login');
  };

  const goToHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            🔧 OAuth Debug Information
          </h1>

          {/* Authentication Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Authentication Status
            </h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-600">Is Loading:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${isLoading ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {isLoading ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Is Authenticated:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {isAuthenticated ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Error Information */}
          {error && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-red-600 mb-4">
                Error Information
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-700 font-mono text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Access Token */}
          {accessToken && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Access Token (from URL)
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-blue-700 font-mono text-sm break-all">
                  {accessToken}
                </p>
              </div>
            </div>
          )}

          {/* User Information */}
          {user ? (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-green-600 mb-4">
                ✅ User Information
              </h2>
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-600">ID:</span>
                    <p className="text-gray-900 font-mono">{user.id}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Name:</span>
                    <p className="text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Email:</span>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Display Name:</span>
                    <p className="text-gray-900">{user.displayName}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="font-medium text-gray-600">Avatar URL:</span>
                  <p className="text-gray-900 font-mono text-sm break-all">{user.avatarUrl}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-red-600 mb-4">
                ❌ No User Information
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-700">No user data available. OAuth callback may have failed.</p>
              </div>
            </div>
          )}

          {/* Current URL Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Current URL Information
            </h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="mb-2">
                <span className="font-medium text-gray-600">Full URL:</span>
                <p className="text-gray-900 font-mono text-sm break-all">
                  {fullUrl ?? 'Loading...'}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Search Params:</span>
                <p className="text-gray-900 font-mono text-sm">
                  {searchStr ?? 'Loading...'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={goToLogin}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Go to Login
            </button>
            <button
              onClick={goToHome}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
