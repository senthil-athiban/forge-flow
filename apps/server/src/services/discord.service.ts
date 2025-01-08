import { DISCORD_CLIENT_ID, DISCORD_REDIRECT_URI } from "@/config/config";

const getRedirectUrl = async () => {
    const redirectUrl = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&permissions=2048&response_type=code&redirect_uri=${DISCORD_REDIRECT_URI}&integration_type=0&scope=guilds+bot`;
    return redirectUrl;
}

export default { getRedirectUrl };