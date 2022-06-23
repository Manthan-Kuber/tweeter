import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import User from "../models/users";
import Tweet from "../models/tweets";
import streamifier from "streamifier";
import { cloud as cloudinary } from "../utils/cloudinaryConfig";

export const fetchHomeTweets = async (req: Request, res: Response) => {
  var { id, skip } = req.body;
  if (!skip) skip = 0;
  try {
    const user = await User.findById(id);
    const tweets = await Tweet.aggregate([
      {
        $match: {
          creator: { $in: user?.following },
        },
      },
      {
        $addFields: {
          retweeted: {
            $filter: {
              input: "$retweetedUsers",
              as: "user",
              cond: {
                $eq: ["$$user", new ObjectId(id)],
              },
            },
          },
          saved: {
            $filter: {
              input: "$savedBy",
              as: "user",
              cond: {
                $eq: ["$$user", new ObjectId(id)],
              },
            },
          },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      { $skip: skip * 10 },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "creator",
          foreignField: "_id",
          as: "creator",
        },
      },
      {
        $project: {
          _id: 0,
          "creator.username": 1,
          "creator.profilePic": 1,
          tweet: 1,
          media: 1,
          likes: {
            $cond: {
              if: { $isArray: "$likes" },
              then: { $size: "$likes" },
              else: 0,
            },
          },
          retweeted: 1,
          saved: 1,
          createdAt: 1,
        },
      },
    ]);
    res.status(200).json({ data: tweets });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const getTweet = async (req: Request, res: Response) => {
  const { id } = req.body;
  const tweetId = req.params.tweetid;

  try {
    const user = await User.findById(id);
    const tweet = await Tweet.aggregate([
      {
        $match: {
          _id: new ObjectId(tweetId),
        },
      },
      {
        $addFields: {
          retweeted: {
            $filter: {
              input: "$retweetedUsers",
              as: "user",
              cond: {
                $eq: ["$$user", new ObjectId(id)],
              },
            },
          },
          saved: {
            $filter: {
              input: "$savedBy",
              as: "user",
              cond: {
                $eq: ["$$user", new ObjectId(id)],
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "creator",
          foreignField: "_id",
          as: "creator",
        },
      },
      {
        $project: {
          _id: 0,
          "creator.username": 1,
          "creator.profilePic": 1,
          tweet: 1,
          media: 1,
          likes: {
            $cond: {
              if: { $isArray: "$likes" },
              then: { $size: "$likes" },
              else: 0,
            },
          },
          retweeted: 1,
          saved: 1,
          createdAt: 1,
        },
      },
    ]);
    res.status(200).json({ data: tweet });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const getBoomarks = async (req: Request, res: Response) => {
  var { id, skip } = req.body;
  if (!skip) skip = 0;

  try {
    const user = await User.findById(id);
    const tweets = await Tweet.aggregate([
      {
        $match: {
          savedBy: id,
        },
      },
      {
        $addFields: {
          retweeted: {
            $filter: {
              input: "$retweetedUsers",
              as: "user",
              cond: {
                $eq: ["$$user", new ObjectId(id)],
              },
            },
          },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      { $skip: skip * 10 },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "creator",
          foreignField: "_id",
          as: "creator",
        },
      },
      {
        $project: {
          _id: 0,
          "creator.username": 1,
          "creator.profilePic": 1,
          tweet: 1,
          media: 1,
          likes: {
            $cond: {
              if: { $isArray: "$likes" },
              then: { $size: "$likes" },
              else: 0,
            },
          },
          retweeted: 1,
          createdAt: 1,
        },
      },
    ]);
    res.status(200).json({ data: tweets });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const createTweet = async (req: Request, res: Response) => {
  const { id, tweet, shared } = req.body;
  const files = req.files as Express.Multer.File[];
  try {
    const newTweet = await Tweet.create({
      creator: id,
      tweet: tweet,
      shared: shared,
    });
    if (files) {
      for (var i = 0; i < files.length; i++) {
        let upload_stream = cloudinary.uploader.upload_stream(
          {
            folder: "tweets",
            public_id: `${newTweet._id}-${i}`,
          },
          async (err, result) => {
            if (err) res.status(400).json({ error: err });
            else if (result) {
              await Tweet.findByIdAndUpdate(newTweet._id, {
                $push: { media: result.secure_url },
              });
            }
          }
        );
        streamifier.createReadStream(files[i].buffer).pipe(upload_stream);
      }
      res
        .status(200)
        .json({ data: newTweet._id, message: "Tweet posted successfully" });
    } else {
      res
        .status(200)
        .json({ data: newTweet._id, message: "Tweet posted successfully" });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const likeTweet = async (req: Request, res: Response) => {
  const { id, tweetid } = req.body;

  try {
    const user = await User.findById(id);
    const tweet = await Tweet.findById(tweetid);
    if (!tweet?.likes?.includes(id)) {
      const updatedTweet = await Tweet.findByIdAndUpdate(id, {
        $inc: { likes: 1 },
      });
      res.status(200).json({ message: "Tweet liked successfully" });
    } else {
      const updatedTweet = await Tweet.findByIdAndUpdate(id, {
        $dec: { likes: 1 },
      });
      res.status(200).json({ message: "Tweet unliked successfully" });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const retweet = async (req: Request, res: Response) => {
  const { id, tweetid } = req.body;

  try {
    const user = await User.findById(id);
    const tweet = await Tweet.findById(tweetid);
    if (!tweet?.retweetedUsers?.includes(id)) {
      const updatedtweet = await Tweet.findByIdAndUpdate(tweetid, {
        $push: { retweetedUsers: id },
      });
      res.status(200).json({ message: "Retweeted tweet successfully" });
    } else {
      const updatedTweet = await Tweet.findByIdAndUpdate(tweetid, {
        $pull: { retweetedUsers: id },
      });
      res.status(200).json({ message: "Removed retweet successfully" });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const saveTweet = async (req: Request, res: Response) => {
  const { id, tweetid } = req.body;

  try {
    const user = await User.findById(id);
    const tweet = await Tweet.findById(tweetid);
    if (!tweet?.savedBy?.includes(id)) {
      const updatedTweet = await Tweet.findByIdAndUpdate(tweetid, {
        $push: { savedBy: id },
      });
      res.status(200).json({ message: "Tweet saved successfully" });
    } else {
      const updatedTweet = await Tweet.findByIdAndUpdate(tweetid, {
        $pull: { savedBy: id },
      });
      res.status(200).json({ message: "Tweet unsaved succesfully" });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const deleteTweet = async (req: Request, res: Response) => {
  const { id, tweetid } = req.body;

  try {
    const tweet = await Tweet.findById(tweetid);
    if (tweet?.creator.toString() === id) {
      if (tweet?.media) {
        for (var i = 0; i < tweet.media.length; i++) {
          cloudinary.uploader.destroy(
            `tweets/${tweet._id}-${i}`,
            async (err, result) => {
              if (err) res.status(400).json({ error: err });
            }
          );
        }
      }
      const result = await Tweet.deleteOne({ _id: tweetid });
      res.status(200).json({ message: "Tweet deleted successfully" });
    } else {
      res.status(403).json({ message: "You cannot delete this tweet" });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};
