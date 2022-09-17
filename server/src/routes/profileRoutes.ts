import express from "express";
const router = express.Router();
import { requireAuth } from "../middleware/authMiddleware";
import {
  media,
  liked,
  tweetsAndRetweets,
  tweetsAndReplies,
  editProfile,
} from "../controllers/profileController";
import { imageUpload as upload } from "../middleware/mediaUpload";

router.put(
  "/edit",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "coverPic", maxCount: 1 },
  ]),
  requireAuth,
  editProfile
);

router.get("/tweets/:userId/:skip", requireAuth, tweetsAndRetweets);

router.get("/tweetsandreplies/:userId/:skip", requireAuth, tweetsAndReplies);

router.get("/media/:userId/:skip", requireAuth, media);

router.get("/likes/:userId/:skip", requireAuth, liked);

export default router;
