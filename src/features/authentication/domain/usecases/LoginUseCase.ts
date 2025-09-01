// Domain Use Case: Login Business Logic
// Encapsulates login business rules and validation

import { User } from '../entities/User';
import { AuthRepository, LoginCredentials, LoginResult } from '../repositories/AuthRepository';

export interface LoginUseCaseInput {
  readonly email: string;
  readonly password: string;
}

export interface LoginUseCaseOutput {
  readonly success: boolean;
  readonly user?: User;
  readonly accessToken?: string;
  readonly error?: string;
}

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(input: LoginUseCaseInput): Promise<LoginUseCaseOutput> {
    try {
      // Business rule validation
      const validationError = this.validateInput(input);
      if (validationError) {
        return {
          success: false,
          error: validationError,
        };
      }

      // Execute login through repository
      const credentials: LoginCredentials = {
        email: input.email.toLowerCase().trim(),
        password: input.password,
      };

      const result: LoginResult = await this.authRepository.login(credentials);

      return {
        success: true,
        user: result.user,
        accessToken: result.accessToken,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    }
  }

  private validateInput(input: LoginUseCaseInput): string | null {
    if (!input.email?.trim()) {
      return 'Email is required';
    }

    if (!this.isValidEmail(input.email)) {
      return 'Invalid email format';
    }

    if (!input.password?.trim()) {
      return 'Password is required';
    }

    if (input.password.length < 6) {
      return 'Password must be at least 6 characters';
    }

    return null;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}