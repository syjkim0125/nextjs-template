// Infrastructure API Client
// Handles external API communication with Anti-corruption layer

import { User } from '../../domain/entities/User';
import { LoginCredentials, LoginResult } from '../../domain/repositories/AuthRepository';

// External API response types (different from domain)
interface ApiLoginResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      full_name: string; // snake_case from API
      created_at: string; // ISO string from API
      updated_at: string; // ISO string from API
    };
    access_token: string;
    refresh_token: string;
  };
  message: string;
}

interface ApiUserResponse {
  success: boolean;
  data: {
    id: string;
    email: string;
    full_name: string;
    created_at: string;
    updated_at: string;
  };
}

export class AuthApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async login(credentials: LoginCredentials): Promise<LoginResult> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
      // Next.js caching
      next: { revalidate: 0 }, // No cache for login
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid email or password');
      }
      throw new Error('Login failed. Please try again.');
    }

    const apiResponse: ApiLoginResponse = await response.json();
    
    if (!apiResponse.success) {
      throw new Error(apiResponse.message || 'Login failed');
    }

    // Anti-corruption layer: Convert API format to Domain format
    return this.mapApiLoginResponseToDomain(apiResponse);
  }

  async logout(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/me`, {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { 
          revalidate: 300, // Cache for 5 minutes
          tags: ['current-user']
        },
      });

      if (response.status === 401) {
        return null; // Not authenticated
      }

      if (!response.ok) {
        throw new Error('Failed to get current user');
      }

      const apiResponse: ApiUserResponse = await response.json();
      
      if (!apiResponse.success) {
        return null;
      }

      return this.mapApiUserToDomain(apiResponse.data);
    } catch {
      return null;
    }
  }

  async refreshToken(refreshToken: string): Promise<LoginResult> {
    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const apiResponse: ApiLoginResponse = await response.json();
    
    if (!apiResponse.success) {
      throw new Error(apiResponse.message || 'Token refresh failed');
    }

    return this.mapApiLoginResponseToDomain(apiResponse);
  }

  // Anti-corruption layer methods
  private mapApiLoginResponseToDomain(apiResponse: ApiLoginResponse): LoginResult {
    const user = this.mapApiUserToDomain(apiResponse.data.user);
    
    return {
      user,
      accessToken: apiResponse.data.access_token,
      refreshToken: apiResponse.data.refresh_token,
    };
  }

  private mapApiUserToDomain(apiUser: ApiLoginResponse['data']['user']): User {
    return new User(
      apiUser.id,
      apiUser.email,
      apiUser.full_name, // API snake_case → Domain camelCase
      new Date(apiUser.created_at), // ISO string → Date
      new Date(apiUser.updated_at) // ISO string → Date
    );
  }
}