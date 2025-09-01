// Next.js specific Authentication Service
// Framework-specific extensions for AuthService

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { AuthService } from './AuthService';
import { LoginUseCaseInput, LoginUseCaseOutput } from '../../domain/usecases/LoginUseCase';
import { User } from '../../domain/entities/User';

export class NextAuthService {
  constructor(private readonly authService: AuthService) {}

  async login(input: LoginUseCaseInput): Promise<LoginUseCaseOutput> {
    const result = await this.authService.login(input);
    
    if (result.success) {
      // Next.js specific cache invalidation
      revalidateTag('current-user');
      revalidateTag('auth-state');
    }
    
    return result;
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    
    // Next.js specific cache invalidation
    revalidateTag('current-user');
    revalidateTag('auth-state');
  }

  async getCurrentUser(): Promise<User | null> {
    return this.authService.getCurrentUser();
  }

  async isAuthenticated(): Promise<boolean> {
    return this.authService.isAuthenticated();
  }

  // Server Action for login form submission
  async loginAction(formData: FormData): Promise<LoginUseCaseOutput> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const result = await this.login({ email, password });
    
    // Next.js specific redirect
    if (result.success) {
      redirect('/' as any); // Redirect to home page for now
    }
    
    return result;
  }

  // Server Action for logout
  async logoutAction(): Promise<void> {
    await this.logout();
    redirect('/login' as any);
  }

  // Check authentication and redirect if needed
  async requireAuth(): Promise<User> {
    const user = await this.getCurrentUser();
    
    if (!user) {
      redirect('/login' as any);
    }
    
    return user;
  }

  // Prevent authenticated users from accessing public pages
  async redirectIfAuthenticated(redirectTo: string = '/'): Promise<void> {
    const isAuth = await this.isAuthenticated();
    
    if (isAuth) {
      redirect(redirectTo as any);
    }
  }
}