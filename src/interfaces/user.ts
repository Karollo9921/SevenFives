import { Document } from 'mongoose';

export default interface InterfaceUser extends Document {
    uid: number;
    login: string;
    password: string;
    rating: number;
};

