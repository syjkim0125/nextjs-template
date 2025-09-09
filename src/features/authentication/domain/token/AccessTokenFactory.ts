import { AccessToken } from './AccessToken';

export class AccessTokenFactory {
    static toDomain(data: string): AccessToken {
        return new AccessToken(data);
    }
}
