import {Schema, model} from 'mongoose';
import { ITweet } from '../types/types';


const tweetSchema = new Schema<ITweet>({
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    tweet: {type: String, required: true},
    media: [String],
    likes: {type: Number, default: 0}
}, {timestamps: true});

export default model<ITweet>('Tweet', tweetSchema);