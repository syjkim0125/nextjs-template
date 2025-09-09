import { ITokenRepository } from '../../domain/token/ITokenRepository';
import { AccessToken, AccessTokenFactory } from '../../domain/token';
import { deleteCookie, popTempAccessTokenAction } from '../actions/token';

export class TokenRepositoryImpl implements ITokenRepository {
    async deleteTempAccessToken(): Promise<void> {
        return deleteCookie('tempAccessToken');
    }

    async popTempAccessToken(): Promise<AccessToken | null> {
        const value = await popTempAccessTokenAction();

        if (!value) {
            return null;
        }

        return AccessTokenFactory.toDomain(value);
    }
}
