import express from "express";
import { logInPost, signUpPost } from "../controllers/authController";
const authRouter = express.Router();

authRouter.post('/signup',signUpPost);

authRouter.post('/login',logInPost);

export default authRouter;