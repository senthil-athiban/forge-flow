import dotenv from 'dotenv';
dotenv.config();
export const JWT_SECRET = process.env.JWT_SECRET!;
export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
export const DOMAIN = process.env.DOMAIN!;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
export const GITHUB_CLIENT_SECRET=process.env.GITHUB_CLIENT_SECRET!;
export const GITHUB_CLIENT_ID=process.env.GITHUB_CLIENT_ID!
export const CLIENT_URL = process.env.CLIENT_URL!;
export const SESSION_SECRET = process.env.SESSION_SECRET!;
export const SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID!;
export const SLACK_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET!;
export const SLACK_REDIRECT_URI = process.env.SLACK_REDIRECT_URI!;

export const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
export const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI!;

export const FROM_EMAIL = process.env.EMAIL_FROM!;

export const S3_BUCKET = process.env.S3_BUCKET!;
export const ACCESS_KEY = process.env.ACCESS_KEY!;
export const SECRET_KEY = process.env.SECRET_KEY!;
export const REGION = process.env.REGION!;