import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization as string;
    console.log(" token : ", token);
    try {
        const payload = jwt.verify(token, JWT_PASSWORD!);
        console.log(" payload : ", payload);
         // @ts-ignore
        req.userId = payload.userId;
        next();
    } catch (error) {
        return res.status(404).json({message: "Un Authorized"});
    }
}