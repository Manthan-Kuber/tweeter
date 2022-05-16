import {Schema, model, connect} from 'mongoose';

interface IUser {
    firstname: string
    lastname: string
    email: string
    username: string
    mobile?: string
    dob?: string
    bio?: string
}

const userSchema = new Schema<IUser>({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String, required: true},cd ..
    username: {type: String, required: true},
    mobile: String,
    dob: String,
    bio: String 
}, {timestamps: true});

const User = model<IUser>('User', userSchema);