import { Router } from "express";
import slackController from "../controller/slack.controller";

const router = Router();
router.get("/callback", slackController.getSlackChannels);

export const slackRouter = router;