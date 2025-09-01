// Application Service - Orchestrates domain logic
// Coordinates between domain use cases and infrastructure
// NOTE: This layer should be framework-agnostic

import { User } from '../../domain/entities/User';
import { LoginUseCase, LoginUseCaseInput, LoginUseCaseOutput } from '../../domain/usecases/LoginUseCase';
import { AuthRepository } from '../../domain/repositories/AuthRepository';

export interface AuthServiceDependencies {
  authRepository: AuthRepository;
  loginUseCase: LoginUseCase;
}

export class AuthService {
  constructor(private readonly dependencies: AuthServiceDependencies) {}

  async login(input: LoginUseCaseInput): Promise<LoginUseCaseOutput> {
    const result = await this.dependencies.loginUseCase.execute(input);
    return result;
  }

  async logout(): Promise<void> {
    await this.dependencies.authRepository.logout();
  }

  async getCurrentUser(): Promise<User | null> {
    return this.dependencies.authRepository.getCurrentUser();
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }
}