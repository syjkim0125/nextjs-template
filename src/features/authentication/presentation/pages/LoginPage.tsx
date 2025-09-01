// Login Page Component - UI Layout
// Combines form with ocean-themed design inspired by provided image

import { OceanBackground } from '../components/OceanBackground';
import { LoginCard } from '../components/LoginCard';
import { LoginHeader } from '../components/LoginHeader';
import { LoginForm } from '../components/LoginForm';
import { LoginFooter } from '../components/LoginFooter';
import { FloatingElements } from '../components/FloatingElements';

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <OceanBackground />
      
      <LoginCard>
        <LoginHeader />
        <LoginForm />
        <LoginFooter />
      </LoginCard>

      <FloatingElements />
    </div>
  );
}