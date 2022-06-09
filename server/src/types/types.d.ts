import { Request } from "express";
import {Model} from "mongoose"

interface IRequest extends Request{
  user?:any; //TODO Restrict type
}

interface UserPayload extends JwtPayload {
  id: string;
}

interface IUser {
  // firstname: string;
  // lastname: string;
  name: string;
  email: string;
  password: string;
  username?: string;
  profilePic?: string;
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
  creator: Schema.Types.ObjectId
  tweet: string
  media?: string[]
  likes?: number
}

interface IComment {
  author: Schema.Types.ObjectId
  tweet: Schema.Types.ObjectId
  likes?: number
}