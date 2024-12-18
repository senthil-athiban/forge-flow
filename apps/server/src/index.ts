import express from "express";
import cors from "cors";
import { userRouter } from "./routes/user";
import { zapRouter } from "./routes/zap.router.";
import { triggerRouter } from "./routes/trigger.router";
import { actionRouter } from "./routes/action.router";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth.router";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
//@ts-ignore
app.use(cookieParser());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/zap", zapRouter);
app.use("/api/v1/trigger", triggerRouter);
app.use("/api/v1/action", actionRouter);


app.listen(process.env.PORT, () => console.log('listening on', process.env.PORT));