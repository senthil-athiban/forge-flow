import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET } from "./config/config";
import { ApiError } from "./config/error";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Check OAuth Session
        if (req.isAuthenticated()) {
            return next();
        }

        // Check JWT Token
        const token = req.headers.authorization;
        if (!token) {
            throw new ApiError(401, "No token provided");
        }

        // Verify JWT
        const payload = jwt.verify(token, JWT_ACCESS_SECRET) as { userId: string };
        
        // Attach User ID 
        //@ts-ignore
        req.userId = payload.userId;
        
        next();
    } catch (error) {
        if (error instanceof ApiError) {
            //@ts-ignore
            return res.status(error.statusCode).json({ 
                message: error.message 
            });
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ 
                message: "Invalid token" 
            });
        }
        return res.status(401).json({ 
            message: "Authentication failed" 
        });
    }
};