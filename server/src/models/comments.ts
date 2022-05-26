import {Schema, model} from 'mongoose';

interface IComment {
    author: Schema.Types.ObjectId
    tweet: Schema.Types.ObjectId
    likes?: number
}

const commentSchema = new Schema<IComment>({
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    tweet: {type: Schema.Types.ObjectId, ref: 'Tweet', required: true},
    likes: {type: Number, default: 0}
}, {timestamps: true});

export default model<IComment>('Comment', commentSchema);