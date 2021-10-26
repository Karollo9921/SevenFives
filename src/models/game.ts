import mongoose, { Schema } from 'mongoose'; 
import InterfaceGame from '../interfaces/game';

const GameSchema: Schema = new Schema(
  {
    numOfPlayers: { type: Number, required: true },
    players: { type: [String], required: true },
    status: { type: String, required: true },
    fullBacklog: { type: [Object] },
    result: { type: [Object] },
    creator: { type: String, required: true },
    creator_uid: { type: Number, required: true }
  }
);

export default mongoose.model<InterfaceGame>('Game', GameSchema);