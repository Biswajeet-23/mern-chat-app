import crypto from "crypto";
import userModel from "../model/userModel.js";
import { create } from "domain";
import { otpModel } from "../model/otpModel.js";
import transporter from "../utils/nodemailer.js";
import { text } from "express";

export const generateOtp = async (req, res) => {
  try {
    const { userId } = req;
    // console.log(userId);
    const user = await userModel.findById(userId);
    if (user) {
      const otp = crypto.randomInt(100000, 999999).toString();
      const createAt = new Date();
      const expiredAt = new Date(createAt.getTime() + 5 * 60 * 1000);

      const mailOptions = {
        from: "emperor3439@gmail.com",
        to: user.email,
        subject: "Chat app otp",
        text: `Dont share the otp: ${otp}`,
      };

      let isPresent = await otpModel.findOne({ userId });
      if (isPresent) {
        let now = new Date();
        let prevCreatedAt = isPresent.createAt;
        if (now - prevCreatedAt < 30 * 1000) {
          return res.status(400).send({ eror: "Wait for 30sec" });
        } else {
          await otpModel.updateOne(
            { userId },
            {
              $set: {
                otp,
                createAt,
                expiredAt,
              },
            }
          );
          return res
            .status(200)
            .send({ message: "Otp sent to the user email" });
        }
      } else {
        const otpData = new otpModel({ userId, otp, createAt, expiredAt });
        await transporter.sendMail(mailOptions);
        await otpData.save();
        return res.status(200).send({
          message: "Otp sent to the user email",
        });
      }
    } else {
      return res.status(400).send({ error: "User not found" });
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: "Something went wrong", errorMessage: err.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(400).send({ error: "User not found" });
    } else {
      let userOtpId = user._id;
      const otpData = await userModel.findOne({ userId: userOtpId });
      const now = new Date();
      if (now > otpData.expiredAt) {
        res.status(400).send({ error: "OTP is expired, generate again" });
      } else {
        let { userOtp } = req.body;
        if (userOtp === otpData.otp) {
          return res.status(200).send({ message: "OTP verified successfully" });
        } else {
          return res
            .status(400)
            .send({ error: "OTP is not matching try again" });
        }
      }
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: "Something went wrong", errorMessage: err.message });
  }
};
