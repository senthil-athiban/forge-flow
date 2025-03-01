import { NextFunction, Request, Response } from "express"
import { ApiError } from "./error";

type AsyncRequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>;

export const asyncMiddleWare = (fn: AsyncRequestHandler) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(error => next(error));
}

export const errorHandler = (err:ApiError, req: Request, res: Response, next: NextFunction) => {
  console.log('[API ERROR]:', err);
  const statusCode = (err as ApiError).statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
  };

  res.status(statusCode).send(response);
};