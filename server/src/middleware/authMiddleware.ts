import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/users";
import { IRequest } from "../types/types";
import { UserPayload } from "../types/types";

export const requireAuth = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET!
    ) as UserPayload;
    const user = await User.findById(decodedToken.id);
    if (!user) next(res.status(404).json("User with this id Not found"));
    req.user = user;
    next();
  } catch (error) {
    return next(res.sendStatus(401));
  }
};
