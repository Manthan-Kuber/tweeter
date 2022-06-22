import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import User from "../models/users";
import Comment from "../models/comments";
import streamifier from "streamifier";
import { cloud as cloudinary } from "../utils/cloudinaryConfig";

export const fetchComments = async (req: Request, res: Response) => {
  var { skip } = req.body;
  if (!skip) skip = 0;
  try {
    if (req.body.tweetid) {
      const { tweetid } = req.body;
      const comments = await Comment.find(
        { tweetid: tweetid },
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
          select: { _id: 0, username: 1, profilePic: 1 },
        });
      let ids: ObjectId[] = [];
      comments.forEach((comment) => {
        ids.push(comment._id);
      });
      const replyCount = await Comment.aggregate([
        {
          $match: { commentid: { $in: ids } },
        },
        {
          $group: {
            _id: "$commentid",
            replyCount: { $sum: 1 },
          },
        },
      ]);
      res
        .status(200)
        .json({ data: { comments: comments, replyCount: replyCount } });
    } else if (req.body.commentid) {
      const { commentid } = req.body;
      const comments = await Comment.find(
        { commentid: commentid },
        {
          _id: 0,
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
          select: { _id: 0, username: 1, profilePic: 1 },
        });
      res.status(200).json({ data: comments });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const createComment = async (req: Request, res: Response) => {
  const { id, comment } = req.body;
  const file = req.file;

  try {
    const user = await User.findById(id);
    if (req.body.tweetid) {
      const { tweetid } = req.body;
      const newComment = await Comment.create({
        author: user?._id,
        tweetid: tweetid,
        comment: comment,
      });
      if (file) {
        const upload_stream = cloudinary.uploader.upload_stream(
          {
            folder: "commentMedia",
            public_id: `${newComment._id}`,
            overwrite: true,
          },
          async (err, result) => {
            if (err) res.status(400).json({ error: err });
            else if (result) {
              const updatedComment = await Comment.findByIdAndUpdate(
                newComment._id,
                { $set: { media: result.secure_url } }
              );
              res.status(200).json({
                data: {
                  author: updatedComment?.author,
                  comment: updatedComment?.comment,
                  likes: updatedComment?.likes,
                },
                message: "Comment created sucessfully",
              });
            }
          }
        );
        streamifier.createReadStream(file.buffer).pipe(upload_stream);
      } else {
        res.status(200).json({
          data: {
            author: newComment.author,
            comment: newComment.comment,
            likes: newComment.likes,
          },
          message: "Comment created sucessfully",
        });
      }
    } else if (req.body.commentid) {
      const { commentid } = req.body;
      const newComment = await Comment.create({
        author: user?._id,
        commentid: commentid,
        comment: comment,
      });
      if (file) {
        const upload_stream = cloudinary.uploader.upload_stream(
          {
            folder: "commentMedia",
            public_id: `${newComment._id}`,
            overwrite: true,
          },
          async (err, result) => {
            if (err) res.status(400).json({ error: err });
            else if (result) {
              const updatedComment = await Comment.findByIdAndUpdate(
                newComment._id,
                { $set: { media: result.secure_url } }
              );
              res.status(200).json({
                data: {
                  author: updatedComment?.author,
                  comment: updatedComment?.comment,
                  likes: updatedComment?.likes,
                },
                message: "Comment created sucessfully",
              });
            }
          }
        );
        streamifier.createReadStream(file.buffer).pipe(upload_stream);
      } else {
        res.status(200).json({
          data: {
            author: newComment.author,
            comment: newComment.comment,
            likes: newComment.likes,
          },
          message: "Comment created sucessfully",
        });
      }
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const likeComment = async (req: Request, res: Response) => {
  const { id, commentid } = req.body;

  try {
    const user = await User.findById(id);
    const comment = await Comment.findById(commentid);
    if (!comment?.likes?.includes(id)) {
      const updatedComment = await Comment.findByIdAndUpdate(id, {
        $inc: { likes: 1 },
      });
      res.status(200).json({ message: "Comment liked successfully" });
    } else {
      const updatedComment = await Comment.findByIdAndUpdate(id, {
        $dec: { likes: 1 },
      });
      res.status(200).json({ message: "Comment unliked successfully" });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};
