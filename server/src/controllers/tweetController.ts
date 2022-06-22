import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import User from "../models/users";
import Tweet from "../models/tweets";
import streamifier from "streamifier";
import { cloud as cloudinary } from "../utils/cloudinaryConfig";

export const fetchTweets = async (req: Request, res: Response) => {
  var { id, skip } = req.body;
  if (!skip) skip = 0;
  try {
    const user = await User.findById(id);
    const tweets = await Tweet.find(
      { creator: { $in: user?.following } },
      {
        _id: 0,
        creator: 1,
        tweet: 1,
        media: 1,
        likes: {
          $cond: {
            if: { $isArray: "$likes" },
            then: { $size: "$likes" },
            else: 0,
          },
        },
        createdAt: 1,
      }
    )
      .sort({ createdAt: -1 })
      .skip(skip * 10)
      .limit(10)
      .populate({
        path: "creator",
        select: { _id: 0, username: 1, profilePic: 1 },
      });
    res.status(200).json({ data: tweets });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const getTweet = async (req: Request, res: Response) => {
  const tweetId = req.params.tweetid;

  try {
    const tweet = await Tweet.findById(tweetId, {
      _id: 0,
      creator: 1,
      tweet: 1,
      media: 1,
      likes: {
        $cond: {
          if: { $isArray: "$likes" },
          then: { $size: "$likes" },
          else: 0,
        },
      },
      createdAt: 1,
    }).populate({
      path: "creator",
      select: { _id: 0, name: 1, username: 1, profilePic: 1 },
    });
    res.status(200).json({ data: tweet });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const createTweet = async (req: Request, res: Response) => {
  const { id, tweet } = req.body;
  const files = req.files as Express.Multer.File[];
  try {
    const newTweet = await Tweet.create({ creator: id, tweet: tweet });
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
