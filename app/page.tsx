import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Next.js Template
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Clean Architecture with Authentication
        </p>
        <div className="space-x-4">
          <Link
            href="/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}