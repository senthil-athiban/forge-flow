import dotenv from "dotenv";
import { sendGridService } from "@repo/common";

dotenv.config();

export const sendEmail = async (to: string, body: any) => {
  const from = "zap@gmail.com";
  const subject = "Zapier test";
  const text = `Dear user, u've received a message.
      ${body}`;
  await sendGridService.sendWorkflowEmail(from, to, subject, text);
};
