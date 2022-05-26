import express from "express";
import { LoginPost, signUpPost } from "../controllers/authController";
const authRouter = express.Router();

authRouter.post('/signup',signUpPost);

authRouter.post('/login',LoginPost);

export default authRouter;