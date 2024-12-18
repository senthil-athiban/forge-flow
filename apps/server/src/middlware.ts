import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET, JWT_SECRET } from "./config/config";
import tokenService from "./services/token.service";
import { TokenType } from "@prisma/client";
import { ApiError } from "./config/error";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization as string;
    console.log(' token : ', token);
    try {
        const payload = jwt.verify(token, JWT_ACCESS_SECRET);
        // const payload = await tokenService.verifyToken(token, TokenType.ACCESS, JWT_ACCESS_SECRET);
        console.log(' payload : ', payload);
         // @ts-ignore
        req.userId = payload.userId;
        next();
    } catch (error) {
        if(error instanceof ApiError) {
            //@ts-ignore
            throw new ApiError(error.statusCode, error.message);
        }
        return res.status(401).json({message: "Un Authorized"});
    }
}