import mongoose, { mongo } from "mongoose";

const userSchema = mongoose.Schema({
  userName: { type: String },
  fullName: { type: String },
  lastName: { type: String },
  mobile: { type: Number },
  email: { type: String },
  gender: { type: String },
  age: { type: Number },
  address: {
    type: {
      location: String,
      landmark: String,
      pin: Number,
      state: String,
      country: String,
    },
  },
  createdIN: { type: Date, default: Date.now },
  password: { type: String },
});

const userModel = mongoose.model("users", userSchema);

export default userModel;
