import { Request, Response, NextFunction } from "express";
import User from "../models/users";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { errHandler } from "../utils/errorHandler";

const createToken = (id: ObjectId) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET!, {
    expiresIn: "1d",
  });
};

export const signUpPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);

    res
      .status(201)
      .json({ user: { id: user._id, email: user.email }, token: token });
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

    res
      .status(200)
      .json({ user: { id: user._id, email: user.email }, token: token });
  } catch (err) {
    const errors = errHandler(err);
    res.status(400).json({ errors });
  }
};
