// Loading UI for login page

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
      <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-8 w-full max-w-md mx-4">
        <div className="text-center">
          {/* Loading skeleton for logo */}
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          </div>
          
          {/* Loading skeleton for title */}
          <div className="h-8 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-100 rounded mb-8 animate-pulse"></div>
          
          {/* Loading skeleton for form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-12 bg-gray-100 rounded animate-pulse"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}