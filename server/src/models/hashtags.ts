import { Schema, model } from "mongoose";
import { IHashtag } from "../types/types";

const hashtagSchema = new Schema<IHashtag>(
  {
    hashtag: { type: String, required: true, unique: true, lowercase: true },
    tweets: { type: Number, default: 0 },
    lastUsed: { type: Date },
  },
  { timestamps: true }
);

export default model<IHashtag>("Hashtag", hashtagSchema);
