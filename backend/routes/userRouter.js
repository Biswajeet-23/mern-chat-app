import express from "express";
import {
  userLogin,
  userSignup,
  getUser,
  userLogout,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/tokenVerification.js";

const userRouter = express.Router();
//demo
userRouter.get("/", (req, res) => {
  res.send("API is working");
});
//signup
userRouter.post("/signup", userSignup);

//login
userRouter.post("/login", userLogin);

//token verification
userRouter.post("/getUser", verifyToken, getUser);

//logout
userRouter.post("/logout", userLogout);

//update user
userRouter.put("/update", verifyToken, updateUser);

//delete user
userRouter.delete("/delete", verifyToken, deleteUser);

export default userRouter;
