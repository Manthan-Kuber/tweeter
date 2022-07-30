import express from "express";
const router = express.Router();
import { requireAuth } from "../middleware/authMiddleware";
import {
  createComment,
  fetchComments,
  likeComment,
  fetchReplies,
  createReply,
  getCommentById,
} from "../controllers/commentController";
import { imageUpload as upload } from "../middleware/mediaUpload";

router.get("/:tweetId/:skip", requireAuth, fetchComments);

router.get("/:commentId", requireAuth, getCommentById);

router.get("/replies/:commentId/:skip", requireAuth, fetchReplies);

router.post("/", requireAuth, upload.array("media", 4), createComment);

router.post("/reply", requireAuth, upload.array("media", 4), createReply);

router.put("/like", requireAuth, likeComment);

export default router;
