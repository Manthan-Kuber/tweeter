import { Response } from "express";
import { IRequest } from "../types/types";
import { ObjectId } from "mongodb";
import User from "../models/users";
import Tweet from "../models/tweets";
import Hashtag from "../models/hashtags";
import streamifier from "streamifier";
import { cloud as cloudinary } from "../utils/cloudinaryConfig";

export const getTweet = async (req: IRequest, res: Response) => {
  const id = req.user?._id;
  const tweetId = req.params.tweetId;

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
          liked: {
            $filter: {
              input: "$likes",
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
          from: "tweets",
          let: { tweetid: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$tweetId", "$$tweetid"] } } },
            { $group: { _id: null, count: { $sum: 1 } } },
            { $project: { _id: 0, count: 1 } },
          ],
          as: "count",
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
          "creator.name": 1,
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
          liked: 1,
          retweeted: 1,
          saved: 1,
          retweetedUsers: { $size: "$retweetedUsers" },
          commentCount: "$count.count",
          createdAt: 1,
        },
      },
    ]);
    res.status(200).json({ data: tweet });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const fetchTweets = async (req: IRequest, res: Response) => {
  let skip = parseInt(req.params.skip);
  const tweetId = req.params.tweetId;
  const id = req.user?._id;
  try {
    const tweets = await Tweet.aggregate([
      {
        $match: {
          tweetId: new ObjectId(tweetId),
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip * 10 },
      { $limit: 10 },
      {
        $lookup: {
          from: "tweets",
          let: { tweetid: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$tweetId", "$$tweetid"] } } },
            { $group: { _id: null, count: { $sum: 1 } } },
            { $project: { _id: 0, count: 1 } },
          ],
          as: "count",
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
          liked: {
            $filter: {
              input: "$likes",
              as: "user",
              cond: {
                $eq: ["$$user", new ObjectId(id)],
              },
            },
          },
        },
      },
      {
        $project: {
          "creator.name": 1,
          "creator.username": 1,
          "creator.profilePic": 1,
          comment: 1,
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
          liked: 1,
          savedBy: { $size: "$savedBy" },
          retweetedUsers: { $size: "$retweetedUsers" },
          createdAt: 1,
          commentCount: "$count.count",
        },
      },
    ]);
    res.status(200).json({ data: tweets });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err });
  }
};

export const getFollowingReplies = async (req: IRequest, res: Response) => {
  const tweetId = req.params.tweetId;
  const id = req.user?._id;

  try {
    const user = await User.findById(id);
    const tweets = await Tweet.aggregate([
      {
        $match: {
          tweetId: new ObjectId(tweetId),
          creator: { $in: user?.following },
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "tweets",
          let: { tweetid: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$tweetId", "$$tweetid"] } } },
            { $group: { _id: null, count: { $sum: 1 } } },
            { $project: { _id: 0, count: 1 } },
          ],
          as: "count",
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
          liked: {
            $filter: {
              input: "$likes",
              as: "user",
              cond: {
                $eq: ["$$user", new ObjectId(id)],
              },
            },
          },
        },
      },
      {
        $project: {
          "creator.name": 1,
          "creator.username": 1,
          "creator.profilePic": 1,
          comment: 1,
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
          liked: 1,
          savedBy: { $size: "$savedBy" },
          retweetedUsers: { $size: "$retweetedUsers" },
          createdAt: 1,
          commentCount: "$count.count",
        },
      },
    ]);
    res.status(200).json({ data: tweets });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err });
  }
};

export const createTweet = async (req: IRequest, res: Response) => {
  const { tweet, shared, hashtags, tweetId } = req.body;
  const id = req.user?._id;
  const files = req.files as Express.Multer.File[];
  try {
    let newTweet: any;
    if (tweetId) {
      newTweet = await Tweet.create({
        creator: id,
        tweetId: tweetId,
        tweet: tweet,
        shared: shared ? shared : true,
        hashtags: hashtags ? hashtags : [],
      });
    } else {
      newTweet = await Tweet.create({
        creator: id,
        tweet: tweet,
        shared: shared ? shared : true,
        hashtags: hashtags ? hashtags : [],
      });
    }
    if (hashtags) {
      for (var i = 0; i < hashtags.length; i++) {
        await Hashtag.findOneAndUpdate(
          { hashtag: hashtags[i].toLowerCase() },
          {
            $set: {
              hashtag: hashtags[i].toLowerCase(),
              lastUsed: new Date(Date.now()),
            },
            $inc: { tweets: 1 },
          },
          { upsert: true }
        );
      }
    }
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
        .json({ data: newTweet, message: "Tweet posted successfully" });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const likeTweet = async (req: IRequest, res: Response) => {
  const { tweetId } = req.body;
  const id = req.user?._id;

  try {
    const user = await User.findById(id);
    const tweet = await Tweet.findById(tweetId);
    if (!tweet?.likes?.includes(id)) {
      await Tweet.updateOne(
        { _id: tweetId },
        {
          $push: { likes: id },
        }
      );
      res.status(200).json({ message: "Tweet liked successfully" });
    } else {
      await Tweet.updateOne(
        { _id: tweetId },
        {
          $pull: { likes: id },
        }
      );
      res.status(200).json({ message: "Tweet unliked successfully" });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const retweet = async (req: IRequest, res: Response) => {
  const { tweetId } = req.body;
  const id = req.user?._id;

  try {
    const user = await User.findById(id);
    const tweet = await Tweet.findById(tweetId);
    if (!tweet?.retweetedUsers?.includes(id)) {
      const updatedtweet = await Tweet.findByIdAndUpdate(tweetId, {
        $push: { retweetedUsers: id },
      });
      res.status(200).json({ message: "Retweeted tweet successfully" });
    } else {
      const updatedTweet = await Tweet.findByIdAndUpdate(tweetId, {
        $pull: { retweetedUsers: id },
      });
      res.status(200).json({ message: "Removed retweet successfully" });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const saveTweet = async (req: IRequest, res: Response) => {
  const { tweetId } = req.body;
  const id = req.user?._id;

  try {
    const user = await User.findById(id);
    const tweet = await Tweet.findById(tweetId);
    if (!tweet?.savedBy?.includes(id)) {
      const updatedTweet = await Tweet.findByIdAndUpdate(tweetId, {
        $push: { savedBy: id },
      });
      res.status(200).json({ message: "Tweet saved successfully" });
    } else {
      const updatedTweet = await Tweet.findByIdAndUpdate(tweetId, {
        $pull: { savedBy: id },
      });
      res.status(200).json({ message: "Tweet unsaved succesfully" });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const deleteTweet = async (req: IRequest, res: Response) => {
  const { tweetId } = req.body;
  const id = req.user?._id;

  try {
    const tweet = await Tweet.findById(tweetId);
    if (tweet?.creator.toString() === id.toString()) {
      if (tweet?.hashtags) {
        for (var hashtag in tweet.hashtags) {
          await Hashtag.findOneAndUpdate(
            { hashtag: hashtag.toLowerCase() },
            { $dec: { tweets: 1 } }
          );
        }
      }
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
      const result = await Tweet.deleteOne({ _id: tweetId });
      res.status(200).json({ message: "Tweet deleted successfully" });
    } else {
      res.status(403).json({ message: "You cannot delete this tweet" });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};
