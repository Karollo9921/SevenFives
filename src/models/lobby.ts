import mongoose, { Schema } from 'mongoose'; 
import InterfaceLobby from '../interfaces/lobby';

const LobbySchema: Schema = new Schema(
    {
        chat: { type: [{ login: String, message: String }], required: true },
        activePlayers: { type: [String], required: true },
        createdGames: { type: [mongoose.Schema.Types.ObjectId], required: true }
    }
);

export default mongoose.model<InterfaceLobby>('Lobby', LobbySchema);