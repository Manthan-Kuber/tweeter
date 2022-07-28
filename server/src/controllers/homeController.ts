import { Response } from "express";
import { IRequest } from "../types/types";
import { ObjectId } from "mongodb";
import User from "../models/users";
import Tweet from "../models/tweets";
import Hashtag from "../models/hashtags";

export const getPopularTags = async (req: IRequest, res: Response) => {
  const skip = parseInt(req.params.skip);
  const limit = parseInt(req.params.limit);
  const id = req.user?._id;

  try {
    const user = await User.findById(id);
    const popularTags = await Hashtag.find()
      .sort({ tweets: -1 })
      .skip(skip)
      .limit(limit);
    res.status(200).json(popularTags);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const getPeopleSuggestions = async (req: IRequest, res: Response) => {
  const skip = parseInt(req.params.skip);
  const limit = parseInt(req.params.limit);
  const id = req.user?._id;

  try {
    const user = await User.findById(id);
    const following = user?.following?user.following:[];
    const peopleSuggestions = await User.aggregate([
      {
        $match: {
          _id: { $nin: following },
        },
      },
      { $addFields: { followerCount: { $size: "$followers" } } },
      { $sort: { followerCount: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);
    res.status(200).json(peopleSuggestions);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const getHomeTweets = async (req: IRequest, res: Response) => {
  const skip = parseInt(req.params.skip);
  const id = req.user?._id;
  try {
    const user = await User.findById(id);
    const tweets = await Tweet.aggregate([
      {
        $match: {
          $or: [
            { creator: { $in: user?.following } },
            { retweetedUsers: { $in: user?.following } },
          ],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      { $skip: skip * 10 },
      { $limit: 10 },
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
          from: "comments",
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
          _id: 0,
          "creator.name" :1,
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
          retweetedUsers: { $size: "$retweetedUsers" },
          commentCount: "$count.count",
          createdAt: 1,
        },
      },
    ]);
    res.status(200).json({ data: tweets });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const getBoomarks = async (req: IRequest, res: Response) => {
  const skip = parseInt(req.params.skip);
  const id = req.user?._id;

  try {
    const user = await User.findById(id);
    const tweets = await Tweet.aggregate([
      {
        $match: {
          savedBy: id,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      { $skip: skip * 10 },
      { $limit: 10 },
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
        $lookup: {
          from: "comments",
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
          _id: 0,
          "creator.name" :1,
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
          retweetedUsers: { $size: "$retweetedUsers" },
          commentCount: "$count.count",
          createdAt: 1,
        },
      },
    ]);
    res.status(200).json({ data: tweets });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};
