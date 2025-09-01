// Login Footer Component
// Sign up link and other footer content

interface LoginFooterProps {
  signUpText?: string;
  signUpLink?: string;
  signUpLabel?: string;
}

export function LoginFooter({
  signUpText = "Don't have an account?",
  signUpLink = "#",
  signUpLabel = "Sign up"
}: LoginFooterProps) {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <p className="text-center text-sm text-gray-500">
        {signUpText}{' '}
        <a 
          href={signUpLink}
          className="font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          {signUpLabel}
        </a>
      </p>
    </div>
  );
}