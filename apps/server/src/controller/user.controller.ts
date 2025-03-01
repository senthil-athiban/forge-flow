import { asyncMiddleWare } from "../config/asyncMiddleware";
import userService from "../services/user.service";
import { Request, Response } from "express";

const getUser = asyncMiddleWare(async (req: Request, res: Response) => {
  console.log('incoming for getuser');
  const userId = req.userId as string;
  const user = await userService.verifyUser(userId);
  res.status(200).send({ user });
});

export default { getUser };
