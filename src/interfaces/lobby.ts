import { Document, ObjectId } from 'mongoose';

export default interface InterfaceLobby extends Document {
    chat: object[];
    activePlayers: string[];
    createdGames: ObjectId[];
};