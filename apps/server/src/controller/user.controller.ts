import { Request, Response } from "express";
import {
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import { ApiError } from "@/config/error";
import { asyncMiddleWare } from "../config/asyncMiddleware";
import userService from "../services/user.service";
import { config } from "dotenv";
import { ACCESS_KEY, REGION, S3_BUCKET, SECRET_KEY } from "@/config/config";

const getUser = asyncMiddleWare(async (req: Request, res: Response) => {
  const userId = req.userId as string;
  const user = await userService.verifyUser(userId);
  res.status(200).send({ user });
});

const editUser = asyncMiddleWare(async (req: Request, res: Response) => {
  const file = req.file;
  console.log({ file });
  console.log("buffer:", req.file?.buffer);
  const userId = req.userId as string;
  const user = await userService.verifyUser(userId);
  if (!user) {
    throw new ApiError(401, "Un authorized to edit");
  }
  // s3 upload
  const client = new S3Client({
    credentials: {
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_KEY,
    },
    region: REGION,
  });
  // const command = new PutObjectCommand({
  //   Bucket: S3_BUCKET,
  //   Key: 'profile_image',
  //   Body: await readFile(filePath),
  // });
  // save response
  //TODO: check from client api
});

export default { getUser, editUser };
