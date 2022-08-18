import { Response } from "express";
import { IRequest } from "../types/types";
import { ObjectId } from "mongodb";
import User from "../models/users";
import Comment from "../models/comments";
import Hashtag from "../models/hashtags";
import streamifier from "streamifier";
import { cloud as cloudinary } from "../utils/cloudinaryConfig";

export const fetchComments = async (req: IRequest, res: Response) => {
  let skip = parseInt(req.params.skip);
  const tweetId = req.params.tweetId;
  if (!skip) skip = 0;
  try {
    const comments = await Comment.aggregate([
      { $match: { tweetId: new ObjectId(tweetId) } },
      { $sort: { createdAt: -1 } },
      { $skip: skip * 10 },
      { $limit: 10 },
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
          "author.name": 1,
          "author.username": 1,
          "author.profilePic": 1,
          comment: 1,
          likes: {
            $cond: {
              if: { $isArray: "$likes" },
              then: { $size: "$likes" },
              else: 0,
            },
          },
          createdAt: 1,
          replyCount: "$count.count",
        },
      },
    ]);
    res.status(200).json({ data: { comments: comments } });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const fetchReplies = async (req: IRequest, res: Response) => {
  let skip = parseInt(req.params.skip);
  const commentId = req.params.commentId;
  if (!skip) skip = 0;

  try {
    const replies = await Comment.find(
      { commentId: commentId },
      {
        author: 1,
        comment: 1,
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
        path: "author",
        select: { name: 1, username: 1, profilePic: 1 },
      });
    res.status(200).json({ data: replies });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const getCommentById = async (req: IRequest, res: Response) => {
  const id = req.user?._id;
  const commentId = req.params.commentId;

  try {
    const user = User.findById(id);
    const comment = await Comment.findById(commentId).populate({
      path: "author",
      select: { name: 1, username: 1, profilePic: 1 },
    });
    res.status(200).json({ data: comment });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const createComment = async (req: IRequest, res: Response) => {
  const { comment, tweetId, hashtags } = req.body;
  const files = req.files as Express.Multer.File[];
  const id = req.user?._id;

  try {
    const user = await User.findById(id);
    const newComment = await Comment.create({
      author: id,
      tweetId: tweetId,
      comment: comment ? comment : "",
      hashtags: hashtags ? hashtags : [],
    });
    if (hashtags) {
      for (var hashtag in hashtags) {
        await Hashtag.findOneAndUpdate(
          { hashtag: hashtag.toLowerCase() },
          {
            $set: {
              hashtag: hashtag.toLowerCase(),
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
            folder: "comments",
            public_id: `${newComment._id}-${i}`,
          },
          async (err, result) => {
            if (err) res.status(400).json({ error: err });
            else if (result) {
              await Comment.findByIdAndUpdate(newComment._id, {
                $push: { media: result.secure_url },
              });
            }
          }
        );
        streamifier.createReadStream(files[i].buffer).pipe(upload_stream);
      }
      res.status(200).json({
        data: newComment._id,
        message: "Comment created successfully",
      });
    } else {
      res.status(200).json({
        data: newComment,
        message: "Comment created sucessfully",
      });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const createReply = async (req: IRequest, res: Response) => {
  const { comment, commentId, hashtags } = req.body;
  const files = req.files as Express.Multer.File[];
  const id = req.user?._id;

  try {
    const user = await User.findById(id);
    const newReply = await Comment.create({
      author: id,
      commentId: commentId,
      comment: comment,
      hashtags: hashtags ? hashtags : [],
    });
    if (hashtags) {
      for (var hashtag in hashtags) {
        await Hashtag.findOneAndUpdate(
          { hashtag: hashtag.toLowerCase() },
          {
            $set: {
              hashtag: hashtag.toLowerCase(),
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
            folder: "comments",
            public_id: `${newReply._id}-${i}`,
          },
          async (err, result) => {
            if (err) res.status(400).json({ error: err });
            else if (result) {
              await Comment.findByIdAndUpdate(newReply._id, {
                $push: { media: result.secure_url },
              });
            }
          }
        );
        streamifier.createReadStream(files[i].buffer).pipe(upload_stream);
      }
      res
        .status(200)
        .json({ data: newReply._id, message: "Comment created successfully" });
    } else {
      res.status(200).json({
        data: newReply,
        message: "Comment created sucessfully",
      });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const likeComment = async (req: IRequest, res: Response) => {
  const { commentId } = req.body;
  const id = req.user?._id;

  try {
    const user = await User.findById(id);
    const comment = await Comment.findById(commentId);
    if (!comment?.likes?.includes(id)) {
      const updatedComment = await Comment.findByIdAndUpdate(commentId, {
        $inc: { likes: 1 },
      });
      res.status(200).json({ message: "Comment liked successfully" });
    } else {
      const updatedComment = await Comment.findByIdAndUpdate(commentId, {
        $dec: { likes: 1 },
      });
      res.status(200).json({ message: "Comment unliked successfully" });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};
