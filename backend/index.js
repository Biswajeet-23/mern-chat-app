import express from "express";
import cors from "cors";
import { config } from "dotenv";
import dbConnect from "./db/dbConnect.js";
import userRouter from "./routes/userRouter.js";
import { otpRouter } from "./routes/otpRouter.js";
import msgRouter from "./routes/messageRouter.js";
import cookieParser from "cookie-parser";

const app = express();

//middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
config("./.env");

const PORT = process.env.PORT;
const HOSTNAME = process.env.HOSTNAME;

//routers
app.use("/users", userRouter);
app.use("/otp", otpRouter);
app.use("/msg", msgRouter);

app.listen(PORT, HOSTNAME, () => {
  console.log(`server is running at http://${HOSTNAME}:${PORT}`);
  dbConnect();
});
