import { Request, Response, NextFunction } from "express";
import User from "../models/users";

const errHandler = (err: any) => {
  console.log(err.message, err.code);
  
  let errors = {
    email: "",
    password: "",
  };

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

export const signUpPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const user = await User.create({ email, password });
    res.status(201).json(user);
  } catch (err) {
    const errorMessages = errHandler(err);
    res.status(400).json(errorMessages);
  }
};

export const logInPost = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  console.log(email, password);
  res.send("<h1>Login</h1>");
};
