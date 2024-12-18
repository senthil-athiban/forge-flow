import passport from 'passport';
import { DOMAIN, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from './config';
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
var GitHubStrategy = require( 'passport-github2' ).Strategy;

passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `/auth/google/callback`,
    passReqToCallback   : true
  },
  function(request: any, accessToken: any, refreshToken: any, profile: any, done: any) {
    console.log("accessToken : " , accessToken, "refreshToken : ", refreshToken, "profile : ", profile);
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
  }
));

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: `/auth/github/callback`,
  },
  function(request: any, accessToken: any, refreshToken: any, profile: any, done: any) {
    console.log("accessToken : " , accessToken, "refreshToken : ", refreshToken, "profile : ", profile);
    // User.findOrCreate({ githubId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
  }
));