import express from "express";
const router = express.Router();
import { requireAuth } from "../middleware/authMiddleware";
import {
  getHomeTweets,
  getBoomarks,
  getPopularTags,
  getPeopleSuggestions
} from "../controllers/homeController";

router.get("/hashtags/:skip/:limit", requireAuth, getPopularTags);

router.get("/people/:skip/:limit", requireAuth, getPeopleSuggestions);

router.get("/tweets/:skip", requireAuth, getHomeTweets);

router.get("/bookmarks/:skip", requireAuth, getBoomarks);

export default router;
