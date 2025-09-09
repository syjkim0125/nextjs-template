import {
    AuthResult,
    IAuthenticationService,
} from '../interfaces/IAuthenticationService';

import { IAuthenticationRepository } from '../../domain/auth/IAuthenticationRepository';
import { ITokenRepository } from '../../domain/token/ITokenRepository';

export class AuthenticationService implements IAuthenticationService {
    constructor(
        private authRepository: IAuthenticationRepository,
        private tokenRepository: ITokenRepository
    ) {}

    async initiateGoogleLogin(): Promise<void> {
        return this.authRepository.initiateGoogleLogin();
    }

    async processOAuthCallback(): Promise<AuthResult> {
        try {
            const tempToken = await this.tokenRepository.popTempAccessToken();

            if (!tempToken) {
                return {
                    success: false,
                    data: null,
                    error: 'there is no access token',
                };
            }

            if (!tempToken.isValid()) {
                return { success: false, data: null, error: 'Invalid token' };
            }

            return { success: true, data: tempToken };
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred';
            return { success: false, data: null, error: message };
        }
    }
}
