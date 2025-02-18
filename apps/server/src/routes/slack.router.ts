import { Router } from "express";
import slackController from "../controller/slack.controller";
import { authMiddleware } from "../middlware";

const router = Router();
router.get("/callback", slackController.storeSlackMetadata);
router.get("/channels", authMiddleware, slackController.getUserSlackChannel);

export const slackRouter = router;