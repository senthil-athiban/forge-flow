import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET } from "./config/config";
import { ApiError } from "./config/error";
import { AuthErrorType } from "./config/tokenTypes";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Check OAuth Session
        if (req.isAuthenticated()) {
            return next();
        }

        // Check JWT Token
        const token = req.headers.authorization;
        if (!token) {
            //@ts-ignore
            throw new ApiError(401, "No token provided", AuthErrorType.NO_TOKEN);
        }

        // Verify JWT
        const payload = jwt.verify(token, JWT_ACCESS_SECRET) as { userId: string };
        
        //@ts-ignore
        req.userId = payload.userId;
        next();
    } catch (error) {
        if (error instanceof ApiError) {
            
            return res.status(error.statusCode).json({ 
                message: error.message,
                type: AuthErrorType.JWT_INVALID
            });
        }

        // OAuth session expired/invalid
        if (!req.isAuthenticated()) {
            return res.status(401).json({
                message: "OAuth session expired",
                type: AuthErrorType.OAUTH_INVALID
            });
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ 
                message: "Invalid token",
                type: AuthErrorType.JWT_INVALID
            });
        }
        return res.status(401).json({ 
            message: "Authentication failed",
            type: AuthErrorType.JWT_INVALID
        });
    }
};