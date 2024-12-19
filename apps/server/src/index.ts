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

dotenv.config();
const app = express();
console.log(process.env.CLIENT_URL);
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

app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/zap", zapRouter);
app.use("/api/v1/trigger", triggerRouter);
app.use("/api/v1/action", actionRouter);
app.get(
    "/google-login",
    passport.authenticate("google", { scope: ["email", "profile"] })
  );
  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      successRedirect: "/auth/google/success",
      failureRedirect: "/auth/google/failure",
    }),
  );


app.listen(process.env.PORT, () => console.log('listening on', process.env.PORT));