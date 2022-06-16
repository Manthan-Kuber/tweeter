import { NextFunction } from "express";
import { Schema, model } from "mongoose";
import isEmail from "validator/lib/isEmail";
import isAlpha from "validator/lib/isAlpha";
import bcrypt from "bcrypt";
import { IUserModel, IUser } from "../types/types";

const userSchema = new Schema<IUser, IUserModel>(
  {
    name: {
      type: String,
      required: [true, "Please Enter your name"],
      validate: [
        (val: string) => isAlpha(val.split(" ").join("")),
        "Please enter a valid name",
      ],
    },
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
    username: { type: String, maxlength: 50 },
    profilePic: String,
    coverPic: String,
    mobile: String,
    dob: String,
    bio: { type: String, maxlength: 160 },
    following: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    followers: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
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
