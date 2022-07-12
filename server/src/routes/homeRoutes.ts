import express from "express";
const router = express.Router();
import { requireAuth } from "../middleware/authMiddleware";
import { getHomeTweets, getBoomarks } from "../controllers/homeController";

router.get("/tweets", requireAuth, getHomeTweets);

router.get("/bookmarks", requireAuth, getBoomarks);

export default router;
