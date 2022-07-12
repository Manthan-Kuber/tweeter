import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import User from "../models/users";
import Tweet from "../models/tweets";
import Comment from "../models/comments";

export const tweetsAndRetweets = async (req: Request, res: Response) => {
  var { id, skip } = req.body;
  if (!skip) skip = 0;

  try {
    const user = await User.findById(id);
    const tweets = await Tweet.aggregate([
      {
        $match: {
          $or: [
            { creator: new ObjectId(id) },
            { retweetedUsers: new ObjectId(id) },
          ],
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
          commentCount: "$count.count",
          retweetedUsers: { $size: "$retweetedUsers" },
          createdAt: 1,
        },
      },
    ]);
    res.status(200).json({ data: tweets });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const media = async (req: Request, res: Response) => {
  var { id, skip } = req.body;
  if (!skip) skip = 0;

  try {
    const user = await User.findById(id);
    const media = await Tweet.aggregate([
      {
        $match: {
          creator: new ObjectId(id),
          media: { $exists: true, $not: { $size: 0 } },
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
          from: "comments",
          let: { tweetid: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$tweetId", "$$tweetid"] } } },
            { $group: { _id: null, count: { $sum: 1 } } },
            { $project: { _id: 0, count: 1 } },
          ],
          as: "commentCount",
        },
      },
      {
        $unionWith: {
          coll: "comments",
          pipeline: [
            {
              $match: {
                author: new ObjectId(id),
                media: { $exists: true, $not: { $size: 0 } },
              },
            },
            {
              $lookup: {
                from: "comments",
                let: { commentid: "$_id" },
                pipeline: [
                  { $match: { $expr: { $eq: ["$commentId", "$$commentid"] } } },
                  { $group: { _id: null, count: { $sum: 1 } } },
                  { $project: { _id: 0, count: 1 } },
                ],
                as: "count",
              },
            },
          ],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      { $skip: skip * 10 },
      { $limit: 10 },
      {
        $project: {
          tweet: 1,
          media: 1,
          likes: {
            $cond: {
              if: { $isArray: "$likes" },
              then: { $size: "$likes" },
              else: 0,
            },
          },
          comment: 1,
          commentCount: "$commentCount.count",
          replyCount: "$count.count",
          retweeted: 1,
          saved: 1,
          retweetedUsers: { $size: "$retweetedUsers" },
          createdAt: 1,
        },
      },
    ]);
    res.status(200).json({ data: media });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const liked = async (req: Request, res: Response) => {
  var { id, skip } = req.body;
  if (!skip) skip = 0;

  try {
    const user = await User.findById(id);
    const liked = await Tweet.aggregate([
      {
        $match: {
          likes: new ObjectId(id),
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
          from: "comments",
          let: { tweetid: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$tweetId", "$$tweetid"] } } },
            { $group: { _id: null, count: { $sum: 1 } } },
            { $project: { _id: 0, count: 1 } },
          ],
          as: "commentCount",
        },
      },
      {
        $unionWith: {
          coll: "comments",
          pipeline: [
            {
              $match: {
                likes: new ObjectId(id),
              },
            },
            {
              $lookup: {
                from: "comments",
                let: { commentid: "$_id" },
                pipeline: [
                  { $match: { $expr: { $eq: ["$commentId", "$$commentid"] } } },
                  { $group: { _id: null, count: { $sum: 1 } } },
                  { $project: { _id: 0, count: 1 } },
                ],
                as: "count",
              },
            },
          ],
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
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $project: {
          "creator.username": 1,
          "creator.profilePic": 1,
          "author.username": 1,
          "author.profilePic": 1,
          tweet: 1,
          media: 1,
          likes: {
            $cond: {
              if: { $isArray: "$likes" },
              then: { $size: "$likes" },
              else: 0,
            },
          },
          comment: 1,
          commentCount: "$commentCount.count",
          replyCount: "$count.count",
          retweeted: 1,
          saved: 1,
          retweetedUsers: { $size: "$retweetedUsers" },
          createdAt: 1,
        },
      },
    ]);
    res.status(200).json({ data: liked });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const tweetsAndReplies = async (req: Request, res: Response) => {
  var { id, skip } = req.body;
  if (!skip) skip = 0;

  try {
    const user = await User.findById(id);
    const replies = await Comment.aggregate([
      {
        $match: {
          author: new ObjectId(id),
          tweetId: { $exists: true },
        },
      },
      { $group: { _id: "$tweetId", comments: { $push: "$$ROOT" } } },
      {
        $lookup: {
          from: "tweets",
          localField: "_id",
          foreignField: "_id",
          as: "_id",
        },
      },
      {
        $unionWith: {
          coll: "comments",
          pipeline: [
            {
              $match: {
                author: new ObjectId(id),
                commentId: { $exists: true },
              },
            },
            { $group: { _id: "$commentId", replies: { $push: "$$ROOT" } } },
            {
              $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "_id",
                as: "_id",
              },
            },
            {
              $lookup: {
                from: "tweets",
                localField: "_id.tweetId",
                foreignField: "_id",
                as: "_id",
              },
            },
          ],
        },
      },
      { $group: { _id: "$_id._id", data: { $push: "$$ROOT" } } },
      {
        $lookup: {
          from: "tweets",
          localField: "_id",
          foreignField: "_id",
          as: "_id",
        },
      },
      { $addFields: { createdAt: "$_id.createdAt" } },
      { $project: { "data.comments": 1, "data.replies": 1, createdAt: 1 } },
    ]);
    const tweetIds = replies.map((item) => item._id[0]._id);
    const tweets = await Tweet.aggregate([
      {
        $match: {
          _id: {
            $nin: tweetIds,
          },
          creator: new ObjectId(id),
          retweetedUsers: new ObjectId(id),
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
          commentCount: "$count.count",
          retweetedUsers: { $size: "$retweetedUsers" },
          createdAt: 1,
        },
      },
    ]);
    let tweetandreplies = replies;
    tweetandreplies.push(tweets);
    tweetandreplies.sort((a, b) => {
      return a.createdAt - b.createdAt;
    });
    res
      .status(200)
      .json({ data: tweetandreplies.slice(skip * 10, skip * 10 + 10) });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};
