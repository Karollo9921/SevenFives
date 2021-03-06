import mongoose, { Schema } from 'mongoose'; 
import InterfaceGame from '../interfaces/game';

const GameSchema: Schema = new Schema(
  {
    numOfPlayers: { type: Number, required: true },
    players: { type: [Object], required: true },
    status: { type: String, required: true },
    fullBacklog: { type: [Object] },
    result: { type: [Object] },
    creator: { type: String, required: true },
    creator_uid: { type: Number, required: true },
    playerTurn: { type: String },
    playerPreviousTurn: { type: String },
    currentBid: { type: [Number] },
    allDices: { type: [Number] },
    numOfAllDices: { type: Number, required: true },
    round: { type: Number, required: true },
    turn: { type: Number, required: true },
  }
);

export default mongoose.model<InterfaceGame>('Game', GameSchema);