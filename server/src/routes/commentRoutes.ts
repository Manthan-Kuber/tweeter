import express from "express";
const router = express.Router();
import { requireAuth } from "../middleware/authMiddleware";
import {
  createComment,
  fetchComments,
  likeComment,
} from "../controllers/commentController";
import { imageUpload as upload } from "../middleware/mediaUpload";

router.get("/", requireAuth, fetchComments);

router.post("/", requireAuth, upload.single("media"), createComment);

router.put("/like", requireAuth, likeComment);

export default router;
