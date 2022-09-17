import { Request } from "express";
import { Model, Schema } from "mongoose";
import { setProfilePic } from "../controllers/userController";

interface IRequest extends Request {
  user?: IUser | null;
}

interface UserPayload extends JwtPayload {
  id: string;
}

interface Files extends Array<Express.Multer.File> {
  profilePic: Array;
  coverPic: Array;
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
  tweetId: Schema.Types.ObjectId;
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
