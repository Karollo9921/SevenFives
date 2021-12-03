import { Document } from 'mongoose';
import { GameStatus } from '../utilities/gameStatus';

export default interface InterfaceGame extends Document {
    numOfPlayers: number;
    players: { login: string, numOfDices: number, position: number, rating: number, dices: string[] }[];
    status: GameStatus;
    fullBacklog: object[];
    result: { place: number, player: string }[];
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
