export const publicRoutes = ["/", "/login", "/register"];
export const NO_SIDEBAR_ROUTES = [
  "/discord/error",
  "/discord/success",
  "/slack/error",
  "/slack/success",
];

console.log('process.env.NEXT_PUBLIC_BACKEND_DOMAIN:', process.env.NEXT_PUBLIC_BACKEND_DOMAIN);
console.log('process.env.SLACK_CLIENT_ID:', process.env.SLACK_CLIENT_ID);
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_DOMAIN!;
export const SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID!;
export const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
export const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI!;
