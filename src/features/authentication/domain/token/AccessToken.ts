// AccessToken Domain Object
// Simple token storage and utility methods

export class AccessToken {
    constructor(private readonly token: string) {}

    /**
     * Get the raw token value
     */
    getValue(): string {
        return this.token;
    }

    /**
     * Get Authorization header value
     */
    getAuthHeader(): string {
        return `Bearer ${this.token}`;
    }

    /**
     * Check if token exists and is not empty
     */
    isValid(): boolean {
        return this.token.length > 0;
    }
}
