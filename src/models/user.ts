import mongoose, { Schema } from 'mongoose'; 
import InterfaceUser from '../interfaces/user';

const UserSchema: Schema = new Schema(
    {
        uid: { type: Number, unique: true },
        login: { type: String, required: true },
        password: { type: String, required: true },
        rating: { type: Number, required: true }
    }
);

export default mongoose.model<InterfaceUser>('User', UserSchema);