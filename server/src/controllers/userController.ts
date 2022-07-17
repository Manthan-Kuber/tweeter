import { Response } from "express";
import { IRequest } from "../types/types";
import { ObjectId } from "mongodb";
import User from "../models/users";
import streamifier from "streamifier";
import { cloud as cloudinary } from "../utils/cloudinaryConfig";

export const getProfile = async (req: IRequest, res: Response) => {
  const id = req.params.userId;

  try {
    const user = await User.aggregate([
      {
        $match: { _id: new ObjectId(id) },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          username: 1,
          profilePic: 1,
          coverPic: 1,
          bio: 1,
          following: {
            $cond: {
              if: { $isArray: "$following" },
              then: { $size: "$following" },
              else: 0,
            },
          },
          followers: {
            $cond: {
              if: { $isArray: "$followers" },
              then: { $size: "$followers" },
              else: 0,
            },
          },
        },
      },
    ]);
    res.status(200).json({ data: user });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const followUser = async (req: IRequest, res: Response) => {
  const { targetid } = req.body;
  const id = req.user?._id;
  try {
    const user = await User.findById(id);
    const targetUser = await User.findById(targetid);
    if (!user?.following?.includes(targetid) && id !== targetid) {
      const updatedUser = await User.findByIdAndUpdate(id, {
        $push: { following: targetid },
      });
      const updatedtargetUser = await User.findByIdAndUpdate(targetid, {
        $push: { followers: id },
      });
      res.status(200).json({ message: "Successfully followed the user" });
    } else if (user?.following?.includes(targetid) && id !== targetid) {
      res.status(200).json({ message: "You already follow the user" });
    } else {
      res.status(400).json({ message: "You cannot follow yourself" });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const unfollowUser = async (req: IRequest, res: Response) => {
  const { targetid } = req.body;
  const id = req.user?._id;

  try {
    const user = await User.findById(id);
    const targetUser = await User.findById(targetid);
    if (!user?.following?.includes(targetid) && id !== targetid) {
      const updatedUser = await User.findByIdAndUpdate(id, {
        $pull: { following: targetid },
      });
      const updatedtargetUser = await User.findByIdAndUpdate(targetid, {
        $pull: { followers: id },
      });
      res.status(200).json({ message: "Successfully unfollowed the user" });
    } else if (user?.following?.includes(targetid) && id !== targetid) {
      res.status(200).json({ message: "You already don't follow the user" });
    } else {
      res.status(400).json({ message: "You cannot unfollow yourself" });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const getFollowers = async (req: IRequest, res: Response) => {
  const { skip } = req.body;
  const id = req.params.userid;

  try {
    const user = await User.findById(id, { _id: 0, followers: 1 }).populate({
      path: "followers",
      select: { _id: 0, name: 1, username: 1, profilPic: 1 },
    });
    res
      .status(200)
      .json({ data: user?.followers?.splice(skip * 10, skip * 10 + 10) });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const getFollowing = async (req: IRequest, res: Response) => {
  const { skip } = req.body;
  const id = req.params.userid;

  try {
    const user = await User.findById(id, { _id: 0, following: 1 }).populate({
      path: "following",
      select: { _id: 0, name: 1, username: 1, profilePic: 1 },
    });
    if (user && user.following) {
      res
        .status(200)
        .json({ data: user.following.splice(skip * 10, skip * 10 + 10) });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const setProfilePic = async (req: IRequest, res: Response) => {
  const id = req.user?._id;
  const file = req.file;
  if (file) {
    try {
      const user = await User.findById(id);
      if (user) {
        const upload_stream = cloudinary.uploader.upload_stream(
          {
            transformation: { width: 500, height: 500, crop: "fill" },
            folder: "profilePictures",
            public_id: `${id}-profile`,
            overwrite: true,
          },
          async (err, result) => {
            if (err) res.status(400).json({ error: err });
            else if (result) {
              const user = await User.findByIdAndUpdate(id, {
                $set: { profilePic: result.secure_url },
              });
              const updatedUser = await User.findById(id);
              res.status(200).json({
                data: updatedUser?.profilePic,
                message: "Profile picture set sucessfully",
              });
            }
          }
        );
        streamifier.createReadStream(file.buffer).pipe(upload_stream);
      }
    } catch (err) {
      res.status(400).json({ error: err });
    }
  } else {
    res.status(400).json({ error: "Please upload a valid image file" });
  }
};

export const deleteProfilePic = async (req: IRequest, res: Response) => {
  const id = req.user?._id;

  try {
    const user = await User.findById(id);
    if (user) {
      cloudinary.uploader.destroy(
        `profilePictures/${id}-profile`,
        async (err, result) => {
          if (err) res.status(400).json({ error: err });
          else {
            const updatedUser = await User.findByIdAndUpdate(id, {
              $set: {
                profilePic:
                  "https://res.cloudinary.com/dpp7elupy/image/upload/v1655131058/profilePictures/default-profile-pic_dzma8t.jpg",
              },
            });
            res
              .status(200)
              .json({ message: "Profile picture removed sucessfully" });
          }
        }
      );
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const setCoverPic = async (req: IRequest, res: Response) => {
  const id = req.user?._id;
  const file = req.file;
  if (file) {
    try {
      const user = await User.findById(id);
      if (user) {
        const upload_stream = cloudinary.uploader.upload_stream(
          {
            transformation: { width: 900, height: 350, crop: "fill" },
            folder: "coverPictures",
            public_id: `${id}-cover`,
            overwrite: true,
          },
          async (err, result) => {
            if (err) res.status(400).json({ error: err });
            else if (result) {
              const user = await User.findByIdAndUpdate(id, {
                $set: { coverPic: result.secure_url },
              });
              const updatedUser = await User.findById(id);
              res.status(200).json({
                data: updatedUser?.coverPic,
                message: "Cover picture set sucessfully",
              });
            }
          }
        );
        streamifier.createReadStream(file.buffer).pipe(upload_stream);
      }
    } catch (err) {
      res.status(400).json({ error: err });
    }
  } else {
    res.status(400).json({ error: "Please upload a valid image file" });
  }
};

export const deleteCoverPic = async (req: IRequest, res: Response) => {
  const id = req.user?._id;

  try {
    const user = await User.findById(id);
    if (user) {
      cloudinary.uploader.destroy(
        `coverPictures/${id}-cover`,
        async (err, result) => {
          if (err) res.status(400).json({ error: err });
          else {
            const updatedUser = await User.findByIdAndUpdate(id, {
              $set: {
                coverPic:
                  "https://res.cloudinary.com/dpp7elupy/image/upload/v1655195992/coverPictures/default-cover_xokejy.png",
              },
            });
            res
              .status(200)
              .json({ message: "Cover picture removed sucessfully" });
          }
        }
      );
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};
