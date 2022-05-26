import { Request, Response, NextFunction } from "express";
import User from "../models/users";

export const signUpPost = async (req: Request, res: Response, next: NextFunction) => {

    const { firstname, lastname,email,username } = req.body;
    console.log( firstname, lastname,email,username)

    try {
       const user = await User.create({ firstname, lastname,email,username })
       res.status(201).json(user);
    } catch (err) {
        console.log(err);
        res.status(400).send("Error in creating user")
    }
};

export const logInPost = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    console.log(email,password)
    res.send("<h1>Login</h1>");
};