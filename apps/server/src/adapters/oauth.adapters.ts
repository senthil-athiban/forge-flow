import { OAuthProfile } from "../types/auth";

const oAuthAdapters = {
    google: (profile: any): OAuthProfile => ({
        id: profile.id,
        email: profile.email,
        displayName: profile.displayName,
        emailVerified: profile.email_verified,
        photos: profile.photos,
        provider: profile.provider
    }),

    github: (profile: any): OAuthProfile => ({
        id: profile.id,
        email: profile.email,
        displayName: profile.displayName,
        emailVerified: profile.emailVerified,
        photos: profile.photos,
        provider: profile.provider,
        username: profile.username
    })
}

export default oAuthAdapters;