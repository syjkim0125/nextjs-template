// Infrastructure Storage Service
// Handles token and user data storage using Next.js patterns

import { User } from '../../domain/entities/User';
import { cookies } from 'next/headers';

interface TokenData {
  accessToken: string;
  refreshToken: string;
}

export class AuthStorageService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user_data';
  
  // Cookie expiry times
  private readonly ACCESS_TOKEN_EXPIRES = 15 * 60 * 1000; // 15 minutes
  private readonly REFRESH_TOKEN_EXPIRES = 7 * 24 * 60 * 60 * 1000; // 7 days

  async storeTokens(tokens: TokenData): Promise<void> {
    const cookieStore = await cookies();
    const now = new Date();
    
    // Store access token (shorter expiry)
    cookieStore.set(this.ACCESS_TOKEN_KEY, tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(now.getTime() + this.ACCESS_TOKEN_EXPIRES),
      path: '/',
    });

    // Store refresh token (longer expiry)
    cookieStore.set(this.REFRESH_TOKEN_KEY, tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(now.getTime() + this.REFRESH_TOKEN_EXPIRES),
      path: '/',
    });
  }

  async getTokens(): Promise<TokenData | null> {
    try {
      const cookieStore = await cookies();
      const accessToken = cookieStore.get(this.ACCESS_TOKEN_KEY)?.value;
      const refreshToken = cookieStore.get(this.REFRESH_TOKEN_KEY)?.value;

      if (!accessToken || !refreshToken) {
        return null;
      }

      return {
        accessToken,
        refreshToken,
      };
    } catch {
      return null;
    }
  }

  async clearTokens(): Promise<void> {
    const cookieStore = await cookies();
    
    cookieStore.delete(this.ACCESS_TOKEN_KEY);
    cookieStore.delete(this.REFRESH_TOKEN_KEY);
    cookieStore.delete(this.USER_KEY);
  }

  async storeUser(user: User): Promise<void> {
    const cookieStore = await cookies();
    
    // Store user data as JSON
    const userData = JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    });
    
    cookieStore.set(this.USER_KEY, userData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(Date.now() + this.REFRESH_TOKEN_EXPIRES),
      path: '/',
    });
  }

  async getUser(): Promise<User | null> {
    try {
      const cookieStore = await cookies();
      const userData = cookieStore.get(this.USER_KEY)?.value;

      if (!userData) {
        return null;
      }

      const userProps = JSON.parse(userData);
      
      // Convert date strings back to Date objects and create User instance
      return new User(
        userProps.id,
        userProps.email,
        userProps.name,
        new Date(userProps.createdAt),
        new Date(userProps.updatedAt)
      );
    } catch {
      return null;
    }
  }

  async clearUser(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(this.USER_KEY);
  }

  // Client-side storage methods (for presentation layer)
  static storeTokensClient(tokens: TokenData): void {
    if (typeof window === 'undefined') return;
    
    // Use sessionStorage for client-side token access (if needed)
    sessionStorage.setItem('auth_session', JSON.stringify({
      accessToken: tokens.accessToken,
      timestamp: Date.now(),
    }));
  }

  static getTokensClient(): { accessToken: string; timestamp: number } | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const session = sessionStorage.getItem('auth_session');
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  }

  static clearTokensClient(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem('auth_session');
  }
}