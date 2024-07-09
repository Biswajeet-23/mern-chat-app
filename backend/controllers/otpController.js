import crypto from "crypto";
import userModel from "../model/userModel.js";
import { create } from "domain";
import { otpModel } from "../model/otpModel.js";

export const generateOtp = async (req, res) => {
  try {
    const { userId } = req;
    // console.log(userId);
    const user = await userModel.findById(userId);
    if (user) {
      const otp = crypto.randomInt(100000, 999999).toString();
      const createAt = new Date();
      const expiredAt = new Date(createAt.getTime() + 5 * 60 * 1000);
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

export const verifyOtp = async (req, res) => {};
