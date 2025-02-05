import { config } from 'dotenv';
config();
export const allowedOrigins = [
    process.env.CLIENT_DOMAIN!,
    process.env.BACKEND_DOMAIN!
]