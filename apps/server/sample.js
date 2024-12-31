const express = require('express');
const { WebClient } = require('@slack/web-api');
require('dotenv').config();

const app = express();
const port = 3000;

// Configure Slack OAuth
const clientId = process.env.SLACK_CLIENT_ID;
const clientSecret = process.env.SLACK_CLIENT_SECRET;
const redirectUri = 'http://localhost:3000/oauth/callback';

app.get('/slack/install', (req, res) => {
  const scopes = ['chat:write', 'channels:read'];
  const slackUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scopes.join(',')}&redirect_uri=${redirectUri}`;
  res.redirect(slackUrl);
});

app.get('/oauth/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const web = new WebClient();
    
    // Exchange code for token
    const response = await web.oauth.v2.access({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri
    });

    // Store these securely in your database
    const workspaceToken = response.access_token;
    const workspaceId = response.team.id;

    // Get channels list
    const slackClient = new WebClient(workspaceToken);
    const channels = await slackClient.conversations.list();

    res.json({
      success: true,
      channels: channels.channels.map(c => ({
        id: c.id,
        name: c.name
      }))
    });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// API endpoint to send message to selected channel
app.post('/send-message', async (req, res) => {
  try {
    const { workspaceToken, channelId, message } = req.body;
    const web = new WebClient(workspaceToken);
    
    const result = await web.chat.postMessage({
      channel: channelId,
      text: message
    });

    res.json({ success: true, messageTs: result.ts });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});