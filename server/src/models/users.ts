import { NextFunction } from "express";
import { Schema, model } from "mongoose";
import isEmail from "validator/lib/isEmail";
import bcrypt from "bcrypt";
import { IUserModel,IUser } from "../types/types";


const userSchema = new Schema<IUser, IUserModel>(
  {
    // firstname: { type: String, required: true },
    // lastname: { type: String, required: true },
    name: { type: String },
    email: {
      type: String,
      required: [true, "Please Enter an Email"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "Please enter a valid Email"],
    },
    password: {
      type: String,
      required: [true, "Please Enter a Password"],
      minlength: [8, "Minimum Password length is 8 characters"],
    },
    username: String,
    mobile: String,
    dob: String,
    bio: String,
  },
  { timestamps: true }
);

//https://mongoosejs.com/docs/middleware.html
userSchema.post("save", (doc, next: NextFunction) => {
  console.log("New user created and saved", doc);
  next();
});

userSchema.pre("save", async function (next) {
  //this refers to 'user' in authController
  console.log("New user about to be created and saved", this); //remove later
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//login method
userSchema.static("login", async function (email: string, password: string) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) return user;
    throw Error("Incorrect Password");
  }
  throw Error("Incorrect Email");
});

export default model<IUser, IUserModel>("User", userSchema);
