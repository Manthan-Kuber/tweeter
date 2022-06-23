import { Schema, model } from "mongoose";
import { ITweet } from "../types/types";

const tweetSchema = new Schema<ITweet>(
  {
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tweet: { type: String, required: true, maxlength: 280 },
    media: [String],
    likes: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    retweetedUsers: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    shared: { type: Boolean, required: true },
    savedBy: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
  },
  { timestamps: true }
);

export default model<ITweet>("Tweet", tweetSchema);
