import express from "express";
import { handleLogout, logInPost, signUpPost } from "../controllers/authController";
const router = express.Router();

router.post("/signup", signUpPost);

router.post("/login", logInPost);

router.get("/clearcookie",handleLogout)

export default router;
