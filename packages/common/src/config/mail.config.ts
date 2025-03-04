import nodemailer from "nodemailer";
import sgMail from '@sendgrid/mail';
import { config } from "dotenv";
config();

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
export { sgMail };