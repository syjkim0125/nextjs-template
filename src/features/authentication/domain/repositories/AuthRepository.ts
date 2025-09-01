// Domain Repository Interface
// Defines contract for authentication operations

import { User, UserId } from '../entities/User';

export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}

export interface LoginResult {
  readonly user: User;
  readonly accessToken: string;
  readonly refreshToken: string;
}

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<LoginResult>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  refreshToken(refreshToken: string): Promise<LoginResult>;
}