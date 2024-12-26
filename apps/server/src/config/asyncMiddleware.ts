import { error } from "console"
import { NextFunction, Request, Response } from "express"

type AsyncRequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>;

export const asyncMiddleWare = (fn: AsyncRequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(error)
}