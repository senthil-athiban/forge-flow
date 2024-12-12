import express from "express";
import cors from "cors";
import { userRouter } from "./routes/user";
import { zapRouter } from "./routes/zap";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/zap", zapRouter);

app.listen(8080, () => console.log('listening on', 8080));