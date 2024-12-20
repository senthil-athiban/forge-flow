export interface OAuthProfile {
    id: string;
    provider: string;
    email: string;
    username?: string;
    displayName?: string;
    photos: { value: string }[];
    emailVerified: boolean;
}

export interface OAuthConfig {
    clientId: string;
    clientSecret: string;
    callbackURL: string;
}

export interface OAuthUser {
    id: string;
    provider: string;
    email?: string;
    image: string;
    displayName: string;
    provider: string;
    accessToken: string;
    refreshToken: string;
}