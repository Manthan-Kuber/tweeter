import { Request,Response,NextFunction } from "express";

export const signUpPost = (req:Request,res:Response,next:NextFunction) => {
    res.send("<h1>Signup</h1>")
}
export const LoginPost = (req:Request,res:Response,next:NextFunction) => {
    res.send("<h1>Login</h1>")
}