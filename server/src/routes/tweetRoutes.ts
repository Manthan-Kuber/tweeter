import express from "express";
const router = express.Router();
import { requireAuth } from "../middleware/authMiddleware";
import {
  createTweet,
  getTweet,
  deleteTweet,
  fetchHomeTweets,
  likeTweet,
  retweet,
  saveTweet,
  getBoomarks
} from "../controllers/tweetController";
import { tweetMediaUpload as upload } from "../middleware/mediaUpload";

router.get("/", requireAuth, fetchHomeTweets);

router.get("/:tweetId", requireAuth, getTweet);

router.post("/", requireAuth, upload.array("media", 4), createTweet);

router.put("/like", requireAuth, likeTweet);

router.put("/retweet", requireAuth, retweet);

router.get("/bookmarks", requireAuth, getBoomarks);

router.put("/save", requireAuth, saveTweet);

router.delete("/", requireAuth, deleteTweet);

export default router;
