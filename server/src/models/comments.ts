import { Schema, model } from "mongoose";
import { IComment } from "../types/types";

const commentSchema = new Schema<IComment>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tweetId: { type: Schema.Types.ObjectId, ref: "Tweet" },
    commentId: { type: Schema.Types.ObjectId, ref: "Comment" },
    comment: { type: String, required: true },
    likes: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    media: { type: String },
  },
  { timestamps: true }
);

export default model<IComment>("Comment", commentSchema);
