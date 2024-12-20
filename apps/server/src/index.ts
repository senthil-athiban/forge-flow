import express from "express";
import cors from "cors";
import { userRouter } from "./routes/user";
import { zapRouter } from "./routes/zap.router.";
import { triggerRouter } from "./routes/trigger.router";
import { actionRouter } from "./routes/action.router";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth.router";
import cookieParser from "cookie-parser";
import passport from "passport";
import cookieSession from "cookie-session";
import "./config/passport";
import session from 'express-session';
dotenv.config();


const app = express();

app.use(express.json());
app.use(cors({origin: [process.env.CLIENT_URL!, "*"], credentials: true}));

//@ts-ignore
app.use(cookieParser());

//@ts-ignore
app.use(cookieSession({
    name: "session",
    keys: ["auth"],
    maxAge: 24 * 60 * 60 * 1000
}));

app.use(passport.session());

//@ts-ignore
app.use(passport.initialize());

//@ts-ignore
app.use(session({ secret: process.env.SESSION_SECRET!, resave: true, saveUninitialized: true, cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
} }));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/zap", zapRouter);
app.use("/api/v1/trigger", triggerRouter);
app.use("/api/v1/action", actionRouter);


app.listen(process.env.PORT, () => console.log('listening on', process.env.PORT));