import { Document } from 'mongoose';
import { GameStatus } from '../utilities/gameStatus';

export default interface InterfaceGame extends Document {
    numOfPlayers: number;
    players: { login: string, numOfDices: number, position: number, dices: string[] }[];
    status: GameStatus;
    fullBacklog: object[];
    result: object[];
    creator: string;
    creator_uid: number;
    playerTurn: string;
    playerPreviousTurn: string;
    currentBid: number[];
    allDices: number[];
    numOfAllDices: number;
    round: number;
    turn: number;
};
