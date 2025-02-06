import dotenv from "dotenv";
import { resendService, transporter } from "@repo/common";

dotenv.config();

export const sendEmail = async (to: string, body: any) => {
  const from = "zap@gmail.com";
  const subject = "Zapier test";
  const text = `Dear user, u've received an message.
      ${body}`;
  await resendService.sendWorkflowEmail(from, to, subject, text);
};
