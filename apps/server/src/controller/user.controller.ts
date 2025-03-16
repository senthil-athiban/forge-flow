import { ApiError } from "@/config/error";
import { asyncMiddleWare } from "../config/asyncMiddleware";
import userService from "../services/user.service";
import { Request, Response } from "express";

const getUser = asyncMiddleWare(async (req: Request, res: Response) => {
  const userId = req.userId as string;
  const user = await userService.verifyUser(userId);
  res.status(200).send({ user });
});

const editUser = asyncMiddleWare( async (req: Request, res: Response) => {
  const userId = req.userId as string;
  const user = await userService.verifyUser(userId);
  if(!user) {
    throw new ApiError(401, "Un authorized to edit");
  }
  //TODO: check from client api
})

export default { getUser, editUser };
