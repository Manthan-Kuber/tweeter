import { Schema, model } from "mongoose";
import { ITweet } from "../types/types";

const tweetSchema = new Schema<ITweet>(
  {
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tweetId: { type: Schema.Types.ObjectId, ref: "Tweet" },
    tweet: { type: String, required: true, maxlength: 280 },
    media: { type: [String], default: [] },
    likes: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    retweetedUsers: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    shared: { type: Boolean, required: true },
    savedBy: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    hashtags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default model<ITweet>("Tweet", tweetSchema);
