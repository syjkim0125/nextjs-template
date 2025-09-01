// Login Card Component
// Glass-morphism card container with decorative elements

interface LoginCardProps {
  children: React.ReactNode;
}

export function LoginCard({ children }: LoginCardProps) {
  return (
    <div className="relative z-10 w-full max-w-md mx-4">
      <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-8">
        {children}
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/20 rounded-full blur-xl"></div>
      <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
    </div>
  );
}