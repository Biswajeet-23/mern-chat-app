import mongoose, { Schema } from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: Schema.Types.ObjectId, require: true, ref: "users" },
    receiverId: { type: Schema.Types.ObjectId, require: true, ref: "users" },
    message: { type: String, require: true },
  },
  { timestamps: true }
);

export const messageModel = mongoose.model("otps", messageSchema);
