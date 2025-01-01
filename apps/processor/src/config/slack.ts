import {WebClient} from '@slack/web-api';

export const sendSlackMessage = async ({workspaceToken, channelId, message}:{workspaceToken: string, channelId: string, message: string}) => {
  try {
    const web = new WebClient(workspaceToken);
    try {
      await web.conversations.join({ channel: channelId });
      console.log('Joined channel successfully');
    } catch (joinError) {
      console.log('Join error:', joinError);
    }
  
    const result = await web.chat.postMessage({
      text: message,
      channel: channelId,
    });

    console.log(`Successfully sent message ${result.ts} in conversation ${channelId}`);
  } catch (error) {
    console.error('Error:', error);
  }
}