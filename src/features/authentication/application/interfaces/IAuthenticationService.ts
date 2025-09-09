import { AccessToken } from '../../domain/token';

export type AuthResult = {
    success: boolean;
    data: AccessToken | null;
    error?: string;
};

export interface IAuthenticationService {
    initiateGoogleLogin(): Promise<void>;
    processOAuthCallback(): Promise<AuthResult>;
}
