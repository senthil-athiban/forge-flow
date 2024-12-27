import 'module-alias/register';
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import passport from "passport";
import cookieSession from "cookie-session";
import session from 'express-session';
import { userRouter } from "./routes/user.router.js";
import { zapRouter } from "./routes/zap.router.js";
import { triggerRouter } from "./routes/trigger.router.js";
import { actionRouter } from "./routes/action.router.js";
import { authRouter } from "./routes/auth.router.js";
import "./config/passport";
import { CLIENT_URL, SESSION_SECRET } from "./config/config.js";
import { errorHandler } from './config/asyncMiddleware.js';

dotenv.config();


const app = express();

app.use(express.json());
app.use(cors({origin: [CLIENT_URL, "*"], credentials: true}));

//@ts-ignore
app.use(cookieSession({
    name: "session",
    keys: ["auth"],
    maxAge: 24 * 60 * 60 * 1000
}));

/*  Parses cookies from request */ 
// @ts-ignore
app.use(cookieParser());

/*  Stores session on server */ 
//@ts-ignore
app.use(session({ secret: SESSION_SECRET, resave: true, saveUninitialized: true, cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
} }));

//@ts-ignore
app.use(passport.initialize());
app.use(passport.session());

/* handle routes */
app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/zap", zapRouter);
app.use("/api/v1/trigger", triggerRouter);
app.use("/api/v1/action", actionRouter);
app.use(errorHandler);


app.listen(process.env.PORT, () => {
    console.log('listening on', process.env.PORT);
    console.log('Ctrl + C to shutdown the server');
});