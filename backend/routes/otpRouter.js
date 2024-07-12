import express from "express";
import { verifyOtp, generateOtp } from "../controllers/otpController.js";
import { verifyToken } from "../middlewares/tokenVerification.js";

export const otpRouter = express.Router();

//demo
otpRouter.get("/", (req, res) => {
  res.send("Otp routing is working");
});

otpRouter.get("/generate", verifyToken, generateOtp);

otpRouter.post("/verify", verifyOtp);
