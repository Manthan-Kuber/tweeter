import express from "express";
const router = express.Router();
import { requireAuth } from "../middleware/authMiddleware";
import {
  createComment,
  fetchComments,
  likeComment,
  fetchReplies,
  createReply,
} from "../controllers/commentController";
import { imageUpload as upload } from "../middleware/mediaUpload";

router.get("/", requireAuth, fetchComments);

router.get("/replies", requireAuth, fetchReplies);

router.post("/", requireAuth, upload.single("media"), createComment);

router.post("/reply", requireAuth, upload.single("media"), createReply);

router.put("/like", requireAuth, likeComment);

export default router;
