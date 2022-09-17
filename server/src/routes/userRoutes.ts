import express from "express";
const router = express.Router();
import { requireAuth } from "../middleware/authMiddleware";
import {
  getProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  deleteProfilePic,
  deleteCoverPic,
} from "../controllers/userController";

router.get("/:userId", requireAuth, getProfile);

router.put("/follow", requireAuth, followUser);

router.put("/unfollow", requireAuth, unfollowUser);

router.get("/followers/:userid/:skip", requireAuth, getFollowers);

router.get("/following/:userid/:skip", requireAuth, getFollowing);

router.delete("/profilePic", requireAuth, deleteProfilePic);

router.delete("/coverpic", requireAuth, deleteCoverPic);

export default router;
