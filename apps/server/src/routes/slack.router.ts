import { Router } from "express";
import slackController from "../controller/slack.controller";

const router = Router();
router.get("/callback", slackController.storeSlackMetadata);
router.get("/channels", slackController.getUserSlackChannel)

export const slackRouter = router;