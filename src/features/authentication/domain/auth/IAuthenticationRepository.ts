export type RefreshAccessTokenResult = {
    success: boolean;
    accessToken?: string;
    error?: string;
};

export interface IAuthenticationRepository {
    initiateGoogleLogin(): Promise<void>;
    refreshAccessToken(): Promise<RefreshAccessTokenResult>;
}
