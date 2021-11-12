import { Document } from 'mongoose';

export default interface InterfaceGame extends Document {
    numOfPlayers: number;
    players: string[];
    status: string;
    fullBacklog: object[];
    result: object[];
    creator: string;
    creator_uid: number;
    playerTurn: string;
    playerPreviousTurn: string;
    currentBid: number[];
    numOfAllDices: number;
    round: number;
    turn: number;
};
