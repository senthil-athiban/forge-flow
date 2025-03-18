import { Request, Response } from "express";
import {
  PutObjectCommand,
  S3Client,
  S3ServiceException,
  GetObjectCommand
} from "@aws-sdk/client-s3";
import { ApiError } from "@/config/error";
import { asyncMiddleWare } from "../config/asyncMiddleware";
import userService from "../services/user.service";
import { config } from "dotenv";
import { ACCESS_KEY, REGION, S3_BUCKET, SECRET_KEY } from "@/config/config";
import { readFile } from "node:fs/promises";

const getUser = asyncMiddleWare(async (req: Request, res: Response) => {
  const userId = req.userId as string;
  const user = await userService.verifyUser(userId);
  res.status(200).send({ user });
});

const editUser = asyncMiddleWare(async (req: Request, res: Response) => {
  const file = req.file;
  const userId = req.userId as string;
  
  const user = await userService.verifyUser(userId);
  if (!user) {
    throw new ApiError(401, "Un authorized to edit");
  }
  
  const client = new S3Client({
    credentials: {
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_KEY,
    },
    region: REGION,
  });
  const path = `/profile/${file?.originalname}`;
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: path,
    Body: await readFile(file?.path!),
  });
  
  // save response
  try {
    const response = await client.send(command);
    console.log(response);
    res.status(201).send({message: "success" });
  } catch (caught) {
    if (
      caught instanceof S3ServiceException &&
      caught.name === "EntityTooLarge"
    ) {
      console.error(
        `Error from S3 while uploading object to ${S3_BUCKET}. \
The object was too large. To upload objects larger than 5GB, use the S3 console (160GB max) \
or the multipart upload API (5TB max).`
      );
    } else if (caught instanceof S3ServiceException) {
      console.error(
        `Error from S3 while uploading object to ${S3_BUCKET}.  ${caught.name}: ${caught.message}`
      );
    } else {
      throw caught;
    }
  }
});

export default { getUser, editUser };
