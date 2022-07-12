import { Request } from "express";
import { Model, Schema } from "mongoose";

interface IRequest extends Request {
  user?: IUser | null;
}

interface UserPayload extends JwtPayload {
  id: string;
}

interface IUser {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  username?: string;
  profilePic?: string;
  coverPic?: string;
  mobile?: string;
  dob?: string;
  bio?: string;
  following?: Schema.Types.ObjectId[];
  followers?: Schema.Types.ObjectId[];
}

//Interface for Model
interface IUserModel extends Model<IUser> {
  login(email: string, password: string): any;
}

interface ITweet {
  creator: Schema.Types.ObjectId;
  tweet: string;
  media?: string[];
  likes?: Schema.Types.ObjectId[];
  retweetedUsers?: Schema.Types.ObjectId[];
  shared: boolean;
  savedBy?: Schema.Types.ObjectId[];
  hashtags?: string[];
}

interface IComment {
  author: Schema.Types.ObjectId;
  tweetId?: Schema.Types.ObjectId;
  commentId?: Schema.Types.ObjectId;
  comment: string;
  likes?: Schema.Types.ObjectId[];
  media?: string;
  hashtags?: string[];
}

interface IHashtag {
  hashtag: string;
  tweets: number;
  lastUsed: Date;
}
