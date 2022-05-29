import { NextFunction } from "express";
import { Schema, model } from "mongoose";
import isEmail from "validator/lib/isEmail";
import bcrypt from "bcrypt"

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
      validate: [isEmail, "Please enter a valid Email"],
    },
    //Temporary
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

userSchema.pre("save",async function (next) {
  //this refers to 'user' in authController
  console.log("New user about to be created and saved", this); //remove later
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password,salt);
  next();
});

export default model<IUser>("User", userSchema);
