import { AccessToken } from './AccessToken';

export interface ITokenRepository {
    deleteTempAccessToken(): Promise<void>;
    popTempAccessToken(): Promise<AccessToken | null>;
}
