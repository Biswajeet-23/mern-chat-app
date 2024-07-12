import userModel from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { verifyToken } from "../middlewares/tokenVerification.js";
config();

export const userSignup = async (req, res) => {
  try {
    const { userName, fullName, password, email } = req.body;
    if (!userName || !password || !fullName || !email) {
      return res.status(400).send({ error: "Provide all required field" });
    } else {
      const isUser = await userModel.findOne({ email });
      if (isUser) {
        return res.status(400).send({ error: "User already Registerd" });
      } else {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = new userModel({ ...req.body, password: hashedPassword });
        let response = await user.save();
        res.status(201).send(response);
      }
    }
  } catch (err) {
    return res
      .status(500)
      .send({ error: "Something Went Wrong ", errorMsg: err.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .send({ error: "provide all the fields before login" });
    } else {
      const response = await userModel.findOne({ email });
      if (response) {
        //bcrypt logic
        let matchPassword = bcrypt.compareSync(password, response.password);
        if (matchPassword) {
          //jwt token logic
          const userId = response._id;
          const token = jwt.sign({ userId }, process.env.JWT_Secret, {
            expiresIn: "7d",
          });
          res.cookie("auth_token", token, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
          });
          return res.status(200).send({ message: "Login successfull" });
        } else {
          return res.status(401).send({ error: "Password is not matching" });
        }
      } else {
        return res.status(401).send({ error: "user not registerd" });
      }
    }
  } catch (err) {
    res
      .status(500)
      .send({ error: "something went wrong", errorMsg: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { userId } = req;
    const userDetails = await userModel
      .findById(userId)
      .select("-_id -password -__v");
    if (!userDetails) {
      res.status(403).send({ error: "User is not available" });
    }
    res.status(200).send(userDetails);
  } catch (err) {
    res
      .status(500)
      .send({ error: "Something went wrong", errorMsg: err.message });
  }
};

export const userLogout = async (req, res) => {
  try {
    res.clearCookie("auth_token");
    return res.status(200).send({ message: "Logout Successful" });
  } catch (err) {
    res
      .status(500)
      .send({ error: "Something went wrong", errorMsg: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.userId;
    const data = req.body;
    const response = await userModel.findByIdAndUpdate(userId, {
      $set: { ...data },
    });
    res.status(200).send({ message: "User Details updated" });
  } catch (err) {
    res
      .status(500)
      .send({ message: "Something went wrong", errorMsg: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.userId;
    const response = await userModel.findByIdAndDelete(userId);
    res.status(200).send({ message: "User deleted successfully" });
  } catch (err) {
    res
      .send(500)
      .send({ message: "Something went wrong", errorMsg: err.message });
  }
};

export const chatUsers = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);
    const chatUsers = await userModel.find({ email: { $ne: user.email } });
    res.status(200).send({ chatUsers });
  } catch (err) {
    res
      .status(500)
      .send({ error: "Something went wrong", errorMessage: err.message });
  }
};
