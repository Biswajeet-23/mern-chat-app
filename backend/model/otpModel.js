import mongoose, { Schema } from "mongoose";

const otpSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, require: true },
  otp: { type: String, require: true },
  createAt: { type: Date, default: Date.now },
  expireAt: { type: Date },
});

export const otpModel = mongoose.model("otps", otpSchema);
