import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.Mail_Username,
    pass: process.env.Mail_Password,
  },
});

export default transporter;
