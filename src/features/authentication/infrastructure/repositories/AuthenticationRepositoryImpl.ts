import {
    IAuthenticationRepository,
    RefreshAccessTokenResult,
} from '../../domain/auth/IAuthenticationRepository';
import {
    redirectToGoogleLogin,
    refreshAccessTokenAction,
} from '../actions/auth';

export class AuthenticationRepositoryImpl implements IAuthenticationRepository {
    async initiateGoogleLogin(): Promise<void> {
        return redirectToGoogleLogin();
    }

    async refreshAccessToken(): Promise<RefreshAccessTokenResult> {
        return refreshAccessTokenAction();
    }
}
