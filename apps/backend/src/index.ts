import express from "express";
import cors from "cors";
import { userRouter } from "./routes/user";
import { zapRouter } from "./routes/zap.router.";
import { triggerRouter } from "./routes/trigger.router";
import { actionRouter } from "./routes/action.router";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/zap", zapRouter);
app.use("/api/v1/trigger", triggerRouter);
app.use("/api/v1/action", actionRouter);


app.listen(8080, () => console.log('listening on', 8080));