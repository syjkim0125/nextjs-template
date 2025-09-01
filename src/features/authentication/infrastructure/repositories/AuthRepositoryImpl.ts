// Infrastructure Repository Implementation
// Implements domain repository interface

import { User } from '../../domain/entities/User';
import { AuthRepository, LoginCredentials, LoginResult } from '../../domain/repositories/AuthRepository';
import { AuthApiClient } from '../api/AuthApiClient';
import { AuthStorageService } from '../storage/AuthStorageService';

export class AuthRepositoryImpl implements AuthRepository {
  constructor(
    private readonly apiClient: AuthApiClient,
    private readonly storageService: AuthStorageService
  ) {}

  async login(credentials: LoginCredentials): Promise<LoginResult> {
    try {
      const result = await this.apiClient.login(credentials);
      
      // Store tokens securely
      await this.storageService.storeTokens({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
      
      // Store user data
      await this.storageService.storeUser(result.user);
      
      return result;
    } catch (error) {
      // Clear any existing tokens on login failure
      await this.storageService.clearTokens();
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // Call API logout endpoint
      await this.apiClient.logout();
    } catch (error) {
      // Continue with local logout even if API call fails
      console.warn('API logout failed, continuing with local logout:', error);
    } finally {
      // Always clear local storage
      await this.storageService.clearTokens();
      await this.storageService.clearUser();
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      // First check if we have tokens
      const tokens = await this.storageService.getTokens();
      if (!tokens?.accessToken) {
        return null;
      }

      // Try to get user from storage first (cache)
      const cachedUser = await this.storageService.getUser();
      if (cachedUser) {
        return cachedUser;
      }

      // Fetch from API if not cached
      const user = await this.apiClient.getCurrentUser();
      if (user) {
        await this.storageService.storeUser(user);
      }
      
      return user;
    } catch (error) {
      console.error('Failed to get current user:', error);
      // Clear tokens if unauthorized
      await this.storageService.clearTokens();
      return null;
    }
  }

  async refreshToken(refreshToken: string): Promise<LoginResult> {
    try {
      const result = await this.apiClient.refreshToken(refreshToken);
      
      // Update stored tokens
      await this.storageService.storeTokens({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
      
      // Update user data
      await this.storageService.storeUser(result.user);
      
      return result;
    } catch (error) {
      // Clear tokens on refresh failure
      await this.storageService.clearTokens();
      throw error;
    }
  }
}