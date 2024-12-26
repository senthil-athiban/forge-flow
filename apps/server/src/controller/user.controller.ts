import { asyncMiddleWare } from "../config/asyncMiddleware";
import userService from "../services/user.service";
import { Request, Response } from "express";

const verifyUser = asyncMiddleWare(async (req: Request, res: Response) => {
  const userId = req.userId as string;
  const user = userService.verifyUser(userId);
  res.status(200).send({ user });
});

export default { verifyUser };
