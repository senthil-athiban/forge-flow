import { NextFunction, Request, Response } from "express";
import jwt, {type JwtPayload} from "jsonwebtoken";
import { JWT_ACCESS_SECRET } from "./config/config";
import { ApiError } from "./config/error";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {

        // Check JWT Token
        const token = req.headers.authorization;
        if (!token) {
            throw new ApiError(401, "No token provided");
        }

        // Verify JWT
        const payload = jwt.verify(token, JWT_ACCESS_SECRET) as JwtPayload;
        req.userId = payload.sub!;
        next();
    } catch (error) {
        let err = new ApiError(401, "Un authorized");
    
        // OAuth session expired/invalid
        // if (!req.isAuthenticated()) {
        //     err = new ApiError(403, "OAuth session expired");
        // }
        if (error instanceof jwt.JsonWebTokenError) {
            err = new ApiError(401, "Invalid token");
        }
        next(err);
        
    }
};