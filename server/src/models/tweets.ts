import {Schema, model} from 'mongoose';

interface ITweet {
    creator: Schema.Types.ObjectId
    tweet: string
    media?: string[]
    likes?: number
}

const tweetSchema = new Schema<ITweet>({
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    tweet: {type: String, required: true},
    media: [String],
    likes: {type: Number, default: 0}
}, {timestamps: true});

module.exports = model<ITweet>('Tweet', tweetSchema);