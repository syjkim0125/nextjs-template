'use server';

// Server Actions for authentication
// These can be called directly from client components

import { authContainer } from '@/features/authentication/application/di/AuthContainer';
import { LoginUseCaseOutput } from '@/features/authentication/domain/usecases/LoginUseCase';
import { User } from '@/features/authentication/domain/entities/User';

export async function loginAction(formData: FormData): Promise<LoginUseCaseOutput> {
  return authContainer.nextAuthService.loginAction(formData);
}

export async function logoutAction(): Promise<void> {
  return authContainer.nextAuthService.logoutAction();
}

export async function getCurrentUserAction(): Promise<User | null> {
  return authContainer.nextAuthService.getCurrentUser();
}

export async function isAuthenticatedAction(): Promise<boolean> {
  return authContainer.nextAuthService.isAuthenticated();
}