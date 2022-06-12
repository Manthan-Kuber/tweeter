import express from "express";
const router = express.Router();
import { getProfile, followUser, unfollowUser, getFollowers, getFollowing, setProfilePic, deleteProfilePic } from "../controllers/userController";
import { profilePicUpload as upload } from "../middleware/mediaUpload"

router.get("/profile",getProfile)

router.put("/follow",followUser)

router.put("/unfollow",unfollowUser)

router.get("/followers",getFollowers)

router.get("/following",getFollowing)

router.post("/profilepic",upload.single('image'),setProfilePic)

router.delete("/profilePic",deleteProfilePic)

export default router;