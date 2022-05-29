import { Request, Response, NextFunction } from "express";
import User from "../models/users";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const errHandler = (err: any) => {
  console.log(err.message, err.code);

  let errors = {
    email: "",
    password: "",
  };

  if(err.message === "Incorrect Email"){
    errors.email = "Incorrect Email Entered"
  }
  
  if(err.message === "Incorrect Password"){
    errors.password = "Incorrect Password Entered"
  }

  if (err.code === 11000) {
    errors.email = "That email is already registered";
    return errors;
  }

  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }: any) => {
      errors[properties.path as keyof typeof errors] = properties.message;
    });
  }

  return errors;
};

const maxAge = 3 * 60 * 60 * 24;
const createToken = (id: ObjectId) => {
  //change secret later
  return jwt.sign({ id }, "Monty's secret max", {
    expiresIn: maxAge, //time in seconds unlike ms in cookies
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
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000, //cookie maxAge in ms
    });
    res.status(201).json({ user: user._id }); //return mongodb userid to client
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
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000, //cookie maxAge in ms
    });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = errHandler(err);
    res.status(400).json({ errors });
  }
};
