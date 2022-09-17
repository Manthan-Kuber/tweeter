import express from "express";
const router = express.Router();
import { requireAuth } from "../middleware/authMiddleware";
import {
  createTweet,
  getTweet,
  fetchTweets,
  getFollowingReplies,
  deleteTweet,
  likeTweet,
  retweet,
  saveTweet,
} from "../controllers/tweetController";
import { tweetMediaUpload as upload } from "../middleware/mediaUpload";

router.get("/:tweetId", requireAuth, getTweet);

router.get("/replies/:tweetId/:skip", requireAuth, fetchTweets);

router.get("/followingReplies/:tweetId", requireAuth, getFollowingReplies);

router.post("/", requireAuth, upload.array("media", 4), createTweet);

router.put("/like", requireAuth, likeTweet);

router.put("/retweet", requireAuth, retweet);

router.put("/save", requireAuth, saveTweet);

router.delete("/", requireAuth, deleteTweet);

export default router;
