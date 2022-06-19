import express from "express";
const router = express.Router();
import { requireAuth } from "../middleware/authMiddleware";
import {
  createTweet,
  getTweet,
  deleteTweet,
  fetchTweets,
  likeTweet,
} from "../controllers/tweetController";
import { tweetMediaUpload as upload } from "../middleware/mediaUpload";

router.get("/", requireAuth, fetchTweets);

router.get("/:tweetid", requireAuth, getTweet);

router.post("/", requireAuth, upload.array("media", 4), createTweet);

router.put("/like", requireAuth, likeTweet);

router.delete("/", requireAuth, deleteTweet);

export default router;
