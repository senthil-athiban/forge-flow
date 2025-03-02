import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
const GitHubStrategy = require("passport-github2").Strategy;
import oAuthAdapters from "../adapters/oauth.adapters";
import oauthService from "../services/oauth.service";
import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "./config";
import { prismaClient } from "../db";
dotenv.config();


const createOAuthStrategy = (
  Strategy: any,
  config: any,
  profileAdapter: (profile: any) => any
) => {
  console.log({ clientID: config.clientID, clientSecret: config.clientSecret, callbackURL: config.callbackURL})
  return new Strategy(
    {
      clientID: config.clientID,
      clientSecret: config.clientSecret,
      callbackURL: config.callbackURL,
      passReqToCallback: true,
    },
    async function (
      request: any,
      accessToken: any,
      refreshToken: any,
      profile: any,
      done: any
    ) {
      console.log('profile : ', profile);
      const adapterProfile = profileAdapter(profile);
      const user = await oauthService.handleOAuthLogin(adapterProfile, {accessToken, refreshToken});
      console.log('done');
      return done(null, user?.id);
    }
  );
};

passport.use(
  createOAuthStrategy(
    GitHubStrategy,
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "/api/v1/auth/github/callback",
    },
    oAuthAdapters.github
  )
);

passport.use(
  createOAuthStrategy(
    GoogleStrategy,
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/auth/google/callback",
    },
    oAuthAdapters.google
  )
);

passport.serializeUser((userId: any, done) => {
  done(null, userId);
});

passport.deserializeUser(async (userId: any, done) => {
  try {
    const result = await prismaClient.user.findUnique({ where: { id: userId } });
    done(null, result);
  } catch (error) {
    done(error, null);
  }
});

