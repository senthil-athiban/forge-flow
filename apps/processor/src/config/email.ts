import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
    }
});

export const sendEmail = async (to: string, subject: any, content: any) => {
    await transporter.sendMail({from: process.env.EMAIL_FROM, to, subject, text: content})
}

export const prepareEmail = async (to: string, body: any) => {
    const subject = "Zapier test";
    const text = `Dear user, u've received an message.
      ${body}`;
    await sendEmail(to, subject, text);
  };