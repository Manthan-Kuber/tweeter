import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import User from "../models/users";
import Tweet from "../models/tweets";

export const getHomeTweets = async (req: Request, res: Response) => {
  var { id, skip } = req.body;
  if (!skip) skip = 0;
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
