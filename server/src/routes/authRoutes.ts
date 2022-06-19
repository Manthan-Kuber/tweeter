import express from "express";
import { logInPost, signUpPost } from "../controllers/authController";
const router = express.Router();

router.post("/signup", signUpPost);

router.post("/login", logInPost);

export default router;
