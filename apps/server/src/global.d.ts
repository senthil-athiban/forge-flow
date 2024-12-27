import { User } from '@repo/db';
declare global {
    namespace Express {
      interface Request {
        userId: string;
        user?: User;
      }
    }
  }

export {};