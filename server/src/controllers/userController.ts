import { Response } from "express";
import { IRequest } from "../types/types";
import { ObjectId } from "mongodb";
import User from "../models/users";
import { cloud as cloudinary } from "../utils/cloudinaryConfig";

export const getProfile = async (req: IRequest, res: Response) => {
  const id: any = req.params.userId;

  try {
    const authuser = await User.findById(req.user?._id);
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
          followed: {
            $cond: {
              if: authuser?.following?.includes(id),
              then: true,
              else: false,
            },
          },
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
    if (
      !user?.following?.includes(targetid) &&
      id.toString() !== targetid.toString()
    ) {
      const updatedUser = await User.findByIdAndUpdate(id, {
        $push: { following: targetid },
      });
      const updatedtargetUser = await User.findByIdAndUpdate(targetid, {
        $push: { followers: id },
      });
      res.status(200).json({ message: "Successfully followed the user" });
    } else if (
      user?.following?.includes(targetid) &&
      id.toString() !== targetid.toString()
    ) {
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
    if (
      user?.following?.includes(targetid) &&
      id.toString() !== targetid.toString()
    ) {
      const updatedUser = await User.findByIdAndUpdate(id, {
        $pull: { following: targetid },
      });
      const updatedtargetUser = await User.findByIdAndUpdate(targetid, {
        $pull: { followers: id },
      });
      res.status(200).json({ message: "Successfully unfollowed the user" });
    } else if (
      !user?.following?.includes(targetid) &&
      id.toString() !== targetid.toString()
    ) {
      res.status(200).json({ message: "You already don't follow the user" });
    } else {
      res.status(400).json({ message: "You cannot unfollow yourself" });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const getFollowers = async (req: IRequest, res: Response) => {
  const skip = parseInt(req.params.skip);
  const id = new ObjectId(req.params.userid);

  try {
    const user = await User.findById(id, {
      followers: { $slice: [skip * 10, skip * 10 + 10] },
    });
    const users = await User.aggregate([
      { $match: { _id: { $in: user?.followers } } },
      {
        $project: {
          name: 1,
          username: 1,
          profilePic: 1,
          bio: 1,
          followed: {
            $cond: {
              if: { $in: ["$_id", user?.following] },
              then: [id],
              else: [],
            },
          },
        },
      },
    ]);
    res.status(200).json({ data: users });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const getFollowing = async (req: IRequest, res: Response) => {
  const skip = parseInt(req.params.skip);
  const id = new ObjectId(req.params.userid);

  try {
    const user = await User.findById(id, {
      following: { $slice: [skip * 10, skip * 10 + 10] },
    });
    const users = await User.aggregate([
      { $match: { _id: { $in: user?.following } } },
      {
        $project: {
          name: 1,
          username: 1,
          profilePic: 1,
          bio: 1,
          followed: {
            $filter: {
              input: "$followers",
              as: "user",
              cond: { $eq: [id, "$$user"] },
            },
          },
        },
      },
    ]);
    res.status(200).json({ data: users });
  } catch (err) {
    res.status(400).json({ error: err });
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
