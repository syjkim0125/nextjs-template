// Dependency Injection Container
// Creates and manages dependencies for authentication feature

import { AuthService } from '../services/AuthService';
import { NextAuthService } from '../services/NextAuthService';
import { LoginUseCase } from '../../domain/usecases/LoginUseCase';
import { AuthRepositoryImpl } from '../../infrastructure/repositories/AuthRepositoryImpl';
import { AuthApiClient } from '../../infrastructure/api/AuthApiClient';
import { AuthStorageService } from '../../infrastructure/storage/AuthStorageService';

// Singleton container for authentication dependencies
class AuthContainer {
  private _authService: AuthService | null = null;
  private _nextAuthService: NextAuthService | null = null;
  private _authRepository: AuthRepositoryImpl | null = null;
  private _authApiClient: AuthApiClient | null = null;
  private _authStorageService: AuthStorageService | null = null;
  private _loginUseCase: LoginUseCase | null = null;

  // Lazy initialization of dependencies
  get authApiClient(): AuthApiClient {
    if (!this._authApiClient) {
      const baseUrl = (typeof window !== 'undefined' 
        ? window.location.origin 
        : process?.env?.NEXT_PUBLIC_API_URL) || '/api';
      this._authApiClient = new AuthApiClient(baseUrl);
    }
    return this._authApiClient;
  }

  get authStorageService(): AuthStorageService {
    if (!this._authStorageService) {
      this._authStorageService = new AuthStorageService();
    }
    return this._authStorageService;
  }

  get authRepository(): AuthRepositoryImpl {
    if (!this._authRepository) {
      this._authRepository = new AuthRepositoryImpl(
        this.authApiClient,
        this.authStorageService
      );
    }
    return this._authRepository;
  }

  get loginUseCase(): LoginUseCase {
    if (!this._loginUseCase) {
      this._loginUseCase = new LoginUseCase(this.authRepository);
    }
    return this._loginUseCase;
  }

  get authService(): AuthService {
    if (!this._authService) {
      this._authService = new AuthService({
        authRepository: this.authRepository,
        loginUseCase: this.loginUseCase,
      });
    }
    return this._authService;
  }

  get nextAuthService(): NextAuthService {
    if (!this._nextAuthService) {
      this._nextAuthService = new NextAuthService(this.authService);
    }
    return this._nextAuthService;
  }

  // Reset container (useful for testing)
  reset(): void {
    this._authService = null;
    this._nextAuthService = null;
    this._authRepository = null;
    this._authApiClient = null;
    this._authStorageService = null;
    this._loginUseCase = null;
  }
}

// Export singleton instance
export const authContainer = new AuthContainer();