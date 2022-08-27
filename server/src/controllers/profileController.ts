import { Response } from "express";
import { Files, IRequest } from "../types/types";
import { ObjectId } from "mongodb";
import User from "../models/users";
import Tweet from "../models/tweets";
import Comment from "../models/comments";
import streamifier from "streamifier";
import { cloud as cloudinary } from "../utils/cloudinaryConfig";

export const editProfile = async (req: IRequest, res: Response) => {
  const id = req.params.userId;
  const { name, username, password, bio } = req.body;
  const files = req.files as Files;
  let profilePic: string | undefined;
  let coverPic: string | undefined;

  try {
    let user = await User.findById(id);
    if (files) {
      if (files.profilePic) {
        let upload_stream = cloudinary.uploader.upload_stream(
          {
            transformation: { width: 500, height: 500, crop: "fill" },
            folder: "profilePictures",
            public_id: `${id}-profile`,
            overwrite: true,
          },
          async (err, result) => {
            if (result) {
              user = await User.findByIdAndUpdate(id, {
                $set: { profilePic: result.secure_url },
              });
            }
          }
        );
        streamifier
          .createReadStream(files.profilePic[0].buffer)
          .pipe(upload_stream);
      }
      if (files.coverPic) {
        let upload_stream = cloudinary.uploader.upload_stream(
          {
            transformation: { width: 900, height: 350, crop: "fill" },
            folder: "coverPictures",
            public_id: `${id}-cover`,
            overwrite: true,
          },
          async (err, result) => {
            if (result) {
              user = await User.findByIdAndUpdate(id, {
                $set: { coverPic: result.secure_url },
              });
            }
          }
        );
        streamifier
          .createReadStream(files.coverPic[0].buffer)
          .pipe(upload_stream);
      }
    }
    await User.updateOne(
      { _id: id },
      {
        $set: {
          name: name,
          username: username,
          bio: bio,
        },
      }
    );
    if (password) {
      await User.updateOne(
        { _id: id },
        {
          $set: {
            password: password,
          },
        }
      );
    }
    if (files.profilePic) {
      profilePic = user?.profilePic;
    }
    if (files.coverPic) {
      coverPic = user?.coverPic;
    }
    res.status(200).json({
      data: { profilePic: profilePic, coverPic: coverPic },
      message: "User info updated successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err });
  }
};

export const tweetsAndRetweets = async (req: IRequest, res: Response) => {
  let skip = parseInt(req.params.skip);
  const id = req.params.userId;
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
          "creator._id": 1,
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
          savedBy: { $size: "$savedBy" },
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

export const media = async (req: IRequest, res: Response) => {
  let skip = parseInt(req.params.skip);
  const id = req.params.userId;
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
          liked: 1,
          retweeted: 1,
          saved: 1,
          savedBy: { $size: "$savedBy" },
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

export const liked = async (req: IRequest, res: Response) => {
  let skip = parseInt(req.params.skip);
  const id = req.params.userId;
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
          "creator._id": 1,
          "creator.name": 1,
          "creator.username": 1,
          "creator.profilePic": 1,
          "author._id": 1,
          "author.name": 1,
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
          savedBy: { $size: "$savedBy" },
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

export const tweetsAndReplies = async (req: IRequest, res: Response) => {
  let skip = parseInt(req.params.skip);
  const id = req.params.userId;
  if (!skip) skip = 0;

  try {
    const user = await User.findById(id);
    const comments = await Comment.aggregate([
      {
        $match: {
          author: new ObjectId(id),
        },
      },
      { $group: { _id: "$tweetId", comment: { $last: "$$ROOT" } } },
      {
        $lookup: {
          from: "comments",
          localField: "comment.commentId",
          foreignField: "_id",
          as: "comment",
        },
      },
      {
        $lookup: {
          from: "tweets",
          localField: "_id",
          foreignField: "_id",
          as: "_id",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id.creator",
          foreignField: "_id",
          as: "creator",
        },
      },
      {
        $lookup: {
          from: "comments",
          let: { tweetid: "$_id._id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$tweetId", "$$tweetid"] } } },
            { $group: { _id: null, count: { $sum: 1 } } },
            { $project: { _id: 0, count: 1 } },
          ],
          as: "count",
        },
      },
      {
        $addFields: {
          "_id.retweeted": {
            $filter: {
              input: "$_id.retweetedUsers",
              as: "user",
              cond: {
                $eq: ["$$user", new ObjectId(id)],
              },
            },
          },
          "_id.saved": {
            $filter: {
              input: "$_id.savedBy",
              as: "user",
              cond: {
                $eq: ["$$user", new ObjectId(id)],
              },
            },
          },
          "_id.liked": {
            $filter: {
              input: "$_id.likes",
              as: "user",
              cond: {
                $eq: ["$$user", new ObjectId(id)],
              },
            },
          },
          "comment.liked": {
            $filter: {
              input: "$comment.likes",
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
          "_id._id": 1,
          "_id.tweet": 1,
          "_id.retweeted": 1,
          "_id.saved": 1,
          "_id.savedBy": { $size: "$_id.savedBy" },
          "_id.retweetedUsers": { $size: "$_id.retweetedUsers" },
          "_id.media": 1,
          "_id.createdAt": 1,
          "_id.commentCount": "$count.count",
          "_id.likes": {
            $cond: {
              if: { $isArray: "$_id.likes" },
              then: { $size: "$_id.likes" },
              else: 0,
            },
          },
          "_id.liked": 1,
          "comment._id": 1,
          "comment.comment": 1,
          "comment.liked": 1,
          "comment.createdAt": 1,
        },
      },
    ]);
    let tweetIds = comments.map((item) => item._id[0]._id);
    const tweets = await Tweet.aggregate([
      {
        $match: {
          _id: {
            $nin: tweetIds,
          },
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
          "creator._id": 1,
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
          retweeted: 1,
          saved: 1,
          liked: 1,
          savedBy: { $size: "$savedBy" },
          commentCount: "$count.count",
          retweetedUsers: { $size: "$retweetedUsers" },
          createdAt: 1,
        },
      },
    ]);
    let tweetandreplies = comments;
    // tweetandreplies.push(replies);
    tweetandreplies.push(tweets);
    tweetandreplies.sort((a, b) => {
      return a.createdAt - b.createdAt;
    });
    res
      .status(200)
      .json({ data: tweetandreplies.slice(skip * 10, skip * 10 + 10) });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err });
  }
};
