import express from "express";
const router = express.Router();
import { requireAuth } from "../middleware/authMiddleware";
import {
  media,
  liked,
  tweetsAndRetweets,
  tweetsAndReplies,
  editProfile
} from "../controllers/profileController";

router.put("/edit", requireAuth, editProfile);

router.get("/tweets", requireAuth, tweetsAndRetweets);

router.get("/tweetsandreplies", requireAuth, tweetsAndReplies);

router.get("/media", requireAuth, media);

router.get("/likes", requireAuth, liked);

export default router;
