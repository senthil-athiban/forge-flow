export const publicRoutes = ["/", "/login", "/register"];
export const NO_SIDEBAR_ROUTES = [
  "/discord/error",
  "/discord/success",
  "/slack/error",
  "/slack/success",
];

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_DOMAIN!;
export const SLACK_CLIENT_ID = process.env.NEXT_PUBLIC_SLACK_CLIENT_ID!;
