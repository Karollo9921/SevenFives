import { Request, Response } from 'express';
import * as socketio from 'socket.io';
import Lobby from '../models/lobby';
import Game from '../models/game';
import { GameStatus } from '../utilities/gameStatus';
import url from '../config/url';


class MultiPlayerLobbyController {

    constructor() {
        
    }

    async getMultiPlayerLobby(req: Request, res: Response) {

        const waitingGames = await Game.find({ status: 'waiting' }, { _id: 1, creator: 1, creator_uid: 1, numOfPlayers: 1 });
        res.json({ 
            isLoggedIn: req.session.isLoggedIn, 
            user: req.session.user,
            waitingGames: waitingGames
        })
    }

    async postCreateMultiPlayerGame(req: Request, res: Response) {
        
        try {
            const game = new Game({
                numOfPlayers: req.body.numOfPlayers,
                players: [ req.session.user?.login ],
                status: GameStatus.Waiting,
                backlog: [],
                result: [],
                creator: req.session.user?.login,
                creator_uid: req.session.user?.uid
            });

            await game.save();

            return res.status(201).json({
                succes: true,
                url: url.url + '/play/multi-player-lobby/' + game._id,
                user: req.session.user,
                game: game
            });

        } catch (error) {
            return res.status(400).json({
                succes: false,
                message: `Error: ${error}`
            })
        }
    }

};


export default MultiPlayerLobbyController;