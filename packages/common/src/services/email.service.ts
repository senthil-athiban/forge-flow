import { config } from "dotenv";
import { Resend } from "resend";

import { transporter } from "../config/mail.config";
import { ApiError } from "../config/error";

import pino from "pino";

config();

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
 });

export interface EmailProvider {
  sendMail(options: EmailOptions): Promise<void>;
}

export interface EmailOptions {
  to: string;
  subject: string;
  content: string;
  from?: string;
}

class NodeMailer implements EmailProvider {
  async sendMail(options: EmailOptions): Promise<void> {
    await transporter.sendMail({
      from: options.from || process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      text: options.content,
    });
  }
}

class ResendProvider implements EmailProvider {
  private client: Resend;

  constructor() {
    this.client = new Resend(process.env.RESEND_API_KEY!);
  }

  async sendMail(options: EmailOptions): Promise<void> {
    
    try {
      const { data, error } = await this.client.emails.send({
        from: "zap@resend.dev",
        to: [options.to],
        subject: options.subject,
        html: options.content,
      });

      if (error) {
        throw new ApiError(400, "Failed to send email");
      }
    } catch (error) {
      logger.error({ error }, "Failed to send email using resend");
      throw new ApiError(400, "Failed to send email");
    }
  }
}

class EmailService {
  private static instance: EmailService;
  private provider: EmailProvider;
  constructor(provider: "nodemailer" | "resend") {
    this.provider = this.getProvider(provider);
  }

  private getProvider(provider: string): EmailProvider {
    switch (provider) {
      case "nodemailer":
        return new NodeMailer();
      default:
      case "resend":
        return new ResendProvider();
    }
  }

  public static getInstance(): EmailService {
    if (!this.instance) {
      this.instance = new EmailService("resend");
    }
    return this.instance;
  }

  public async sendWorkflowEmail(from: string, to: string, subject: string, body: any) {
    await this.provider.sendMail({from: from, to: to, subject: subject, content: body});
  }
}

export default EmailService;