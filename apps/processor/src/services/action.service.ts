import { discordService, slackService } from "@repo/common";
import { processContent } from "../config/algo";
import { sendEmail } from "../config/email";

export type ActionType = "email" | "slack" | "discord";

interface ActionHandler {
  execute(params: ActionParams): Promise<void>;
}

interface ActionParams {
  metadata: any;
  hooksMetadata: any;
}

class EmailHandler implements ActionHandler {
  async execute({ metadata, hooksMetadata }: ActionParams): Promise<void> {
    const data = processContent("email", metadata, hooksMetadata);
    await sendEmail(data?.to, data?.content);
  }
}

class SlackHandler implements ActionHandler {
  async execute({ metadata, hooksMetadata }: ActionParams): Promise<void> {
    const { channelId } = metadata as any;
    const { message } = hooksMetadata as any;
    const slackWorkspaceToken =
      await slackService.getSlackChannelById(channelId);
    const workspaceToken = slackWorkspaceToken?.slack.workspaceToken as string;
    await slackService.sendMessage({ workspaceToken, channelId, message });
  }
}

class DiscordHandler implements ActionHandler {
  async execute({ metadata, hooksMetadata }: ActionParams): Promise<void> {
    const { channelId } = metadata as any;
    const { message } = hooksMetadata as any;

    const channel = await discordService.findChannelById(channelId);
    await discordService.sendMessage(
      channel?.discord.guildId!,
      channel?.channelId!,
      message
    );
  }
}

class ActionService {
  private static instance: ActionService;
  private handler: Map<string, ActionHandler>;
  constructor() {
    this.handler = new Map([
      ["email", new EmailHandler()],
      ["slack", new SlackHandler()],
      ["discord", new DiscordHandler()],
    ]);
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new ActionService();
    }
    return this.instance;
  }

  public async executeAction(type: ActionType, params: ActionParams) {
    const handler = this.handler.get(type);
    if (!handler) {
      throw new Error("No handler has been found");
    }
    await handler.execute(params);
  }
}

export default ActionService;
