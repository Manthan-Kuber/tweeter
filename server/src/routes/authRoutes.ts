import express from "express";
import {
  handleCookieClear,
  handleLogin,
  handleSignUp,
} from "../controllers/authController";
const router = express.Router();

router.post("/signup", handleSignUp);

router.post("/login", handleLogin);

router.get("/clearcookie", handleCookieClear);

export default router;
