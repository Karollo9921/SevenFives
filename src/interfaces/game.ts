import { Document } from 'mongoose';

export default interface InterfaceGame extends Document {
    numOfPlayers: number;
    players: string[];
    status: string;
    fullBacklog: object[];
    result: object[];
};
