import { Request, Response, NextFunction } from "express";
import User from "../models/users";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { errHandler } from "../utils/errorHandler";
import { userInfo } from "os";

const createToken = (id: ObjectId) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET!);
};

export const signUpPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);
  let username: string = "";

  try {
    while (true) {
      username =
        name.split(" ")[0].slice(0, 4) + Math.floor(Math.random() * 10000 + 1);
      const user = await User.find({ username: username });
      if (user.length === 0) {
        break;
      }
    }
    const user = await User.create({
      name,
      email,
      password,
      username,
      profilePic:
        "https://res.cloudinary.com/dpp7elupy/image/upload/v1655131058/profilePictures/default-profile-pic_dzma8t.jpg",
      coverPic:
        "https://res.cloudinary.com/dpp7elupy/image/upload/v1655195992/coverPictures/default-cover_xokejy.png",
    });
    const token = createToken(user._id);

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
      },
      token: token,
    });
  } catch (err) {
    const errors = errHandler(err);
    res.status(400).json({ errors });
  }
};

export const logInPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
      },
      token: token,
    });
  } catch (err) {
    const errors = errHandler(err);
    res.status(400).json({ errors });
  }
};
