// Login Header Component
// Avatar icon with title and subtitle

interface LoginHeaderProps {
  title?: string;
  subtitle?: string;
}

export function LoginHeader({ 
  title = "Welcome Back",
  subtitle = "Sign in to your account to continue"
}: LoginHeaderProps) {
  return (
    <div className="text-center mb-8">
      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
        <svg 
          className="w-10 h-10 text-white" 
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
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {title}
      </h1>
      <p className="text-gray-600">
        {subtitle}
      </p>
    </div>
  );
}