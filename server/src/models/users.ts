import { Schema, model } from "mongoose";
import isEmail from "validator/lib/isEmail";

interface IUser {
  // firstname: string;
  // lastname: string;
  name: string;
  email: string;
  password: string;
  username?: string;
  mobile?: string;
  dob?: string;
  bio?: string;
}

const userSchema = new Schema<IUser>(
  {
    // firstname: { type: String, required: true },
    // lastname: { type: String, required: true },
    name: { type: String },
    email: {
      type: String,
      required: [true, "Please Enter an Email"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "Please enter a valid email"],
    },
    //Temporary
    password: {
      type: String,
      required: [true, "Please Enter a password"],
      minlength: [8, "Minimum password length is 8 characters"],
    },
    username: String,
    mobile: String,
    dob: String,
    bio: String,
  },
  { timestamps: true }
);

export default model<IUser>("User", userSchema);
