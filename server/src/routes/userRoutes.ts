import express from "express";
const router = express.Router();
import { requireAuth } from "../middleware/authMiddleware";
import {
  getProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  setProfilePic,
  deleteProfilePic,
  setCoverPic,
  deleteCoverPic,
} from "../controllers/userController";
import { imageUpload as upload } from "../middleware/mediaUpload";

router.get("/:userId", requireAuth, getProfile);

router.put("/follow", requireAuth, followUser);

router.put("/unfollow", requireAuth, unfollowUser);

router.get("/followers/:userid", requireAuth, getFollowers);

router.get("/following/:userid", requireAuth, getFollowing);

router.post("/profilepic", requireAuth, upload.single("image"), setProfilePic);

router.delete("/profilePic", requireAuth, deleteProfilePic);

router.post("/coverpic", requireAuth, upload.single("image"), setCoverPic);

router.delete("/coverpic", requireAuth, deleteCoverPic);

export default router;
